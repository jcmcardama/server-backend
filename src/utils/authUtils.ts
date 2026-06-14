import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback_access_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';

/**
 * Hashes a plaintext password using bcrypt with a salt factor of 12.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

/**
 * Compares a plaintext password against a stored hash.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generates a short-lived Access Token (expires in 15 minutes).
 */
export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
};

/**
 * Generates a long-lived Refresh Token (expires in 7 days).
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

/**
 * Verifies an Access Token and returns the decoded payload.
 */
export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, ACCESS_SECRET);
};

/**
 * Verifies a Refresh Token and returns the decoded payload.
 */
export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, REFRESH_SECRET);
};