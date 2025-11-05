import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    displayName: z.string().min(2, 'Display name must be at least 2 characters long').optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({}),
});

export const logoutSchema = z.object({
  body: z.object({}),
});