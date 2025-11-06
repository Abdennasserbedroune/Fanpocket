import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { CreateUserDto, LoginDto, AuthResponse } from '@fanpocket/shared';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  } as jwt.SignOptions);
};

// Set HTTP-only cookie with refresh token
const setRefreshTokenCookie = (res: express.Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to convert user document to response format
const formatUserResponse = (user: any) => {
  const userResponse = user.toJSON();
  delete userResponse.password;
  return {
    ...userResponse,
    id: userResponse._id,
  };
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, displayName, locale }: CreateUserDto =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? 'Email already exists'
            : 'Username already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      username,
      password: hashedPassword,
      displayName,
      locale: locale || 'en',
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    const authResponse: AuthResponse = {
      user: formatUserResponse(user),
      token,
    };

    res.status(201).json(authResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginDto = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateToken(user.id);

    // Set refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    const authResponse: AuthResponse = {
      user: formatUserResponse(user),
      token,
    };

    res.json(authResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userResponse = user.toJSON();
    delete (userResponse as any).password;

    res.json(userResponse);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, config.jwt.secret) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const token = generateToken(user.id);
    const newRefreshToken = generateToken(user.id);

    // Set new refresh token cookie
    setRefreshTokenCookie(res, newRefreshToken);

    const authResponse: AuthResponse = {
      user: formatUserResponse(user),
      token,
    };

    res.json(authResponse);
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

export default router;
