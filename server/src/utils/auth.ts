import bcrypt from 'bcryptjs';
import { UserDocument } from '../models/User';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const sanitizeUser = (user: UserDocument) => {
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.refreshTokens;
  return userObject;
};