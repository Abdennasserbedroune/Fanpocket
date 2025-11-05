import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { UserDocument } from '../models/User';

export interface JwtPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (user: UserDocument): string => {
  const payload: JwtPayload = {
    userId: (user._id as any).toString(),
    email: user.email,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire as any,
  });
};

export const generateRefreshToken = (): string => {
  return jwt.sign({}, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire as any,
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): boolean => {
  try {
    jwt.verify(token, config.jwt.refreshSecret);
    return true;
  } catch {
    return false;
  }
};

export const hashRefreshToken = (token: string): string => {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(token).digest('hex');
};