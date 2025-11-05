import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { hashPassword, comparePassword, sanitizeUser } from '../utils/auth';
import { generateAccessToken, generateRefreshToken, hashRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema, refreshTokenSchema, logoutSchema } from '../schemas/auth';
import { AuthenticatedRequest, authenticate } from '../middleware/auth';

const router = Router();

// Helper function to set auth cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('access-token', accessToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refresh-token', refreshToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh',
  });
};

// Helper function to clear auth cookies
const clearAuthCookies = (res: Response) => {
  res.clearCookie('access-token');
  res.clearCookie('refresh-token', { path: '/api/auth/refresh' });
};

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const { email, password, username, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: existingUser.email === email ? 'Email already registered' : 'Username already taken',
      });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      displayName: displayName || username,
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Store refresh token
    user.refreshTokens.push({
      token: hashedRefreshToken,
      createdAt: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    await user.save();

    // Set cookies and return user
    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const message = field === 'email' ? 'Email already registered' : 'Username already taken';
      return res.status(409).json({
        success: false,
        error: message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with password and refreshTokens
    const user = await User.findOne({ email }).select('+password +refreshTokens');
    if (!user) {
      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      // Add delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100));
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
    const hashedRefreshToken = hashRefreshToken(refreshToken);

    // Store refresh token
    user.refreshTokens.push({
      token: hashedRefreshToken,
      createdAt: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    await user.save();

    // Set cookies and return user
    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
    });
  }
});

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refresh-token'];
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    // Verify refresh token
    if (!verifyRefreshToken(refreshToken)) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
      });
    }

    // Hash the token and find user
    const hashedRefreshToken = hashRefreshToken(refreshToken);
    const user = await User.findOne({ 
      'refreshTokens.token': hashedRefreshToken 
    }).select('+refreshTokens');

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token - user not found',
      });
    }

    // Remove the used refresh token (token rotation)
    user.refreshTokens = user.refreshTokens.filter(
      token => token.token !== hashedRefreshToken
    );

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken();
    const newHashedRefreshToken = hashRefreshToken(newRefreshToken);

    // Store new refresh token
    user.refreshTokens.push({
      token: newHashedRefreshToken,
      createdAt: new Date(),
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    await user.save();

    // Set new cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    clearAuthCookies(res);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
    });
  }
});

// POST /api/auth/logout
router.post('/logout', authenticate, validate(logoutSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const refreshToken = req.cookies['refresh-token'];
    
    if (refreshToken) {
      const hashedRefreshToken = hashRefreshToken(refreshToken);
      
      // Remove the refresh token from user's tokens
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { refreshTokens: { token: hashedRefreshToken } } }
      );
    }

    // Clear cookies
    clearAuthCookies(res);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user information',
    });
  }
});

export default router;