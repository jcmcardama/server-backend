import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

// Shared production-grade cookie security settings
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript (XSS attacks) from reading these tokens entirely
  secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
  sameSite: 'strict' as const, // Blocks CSRF cross-origin cookie sharing attacks completely
};

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000; // 15 Minutes matching token lifespan
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 Days matching token lifespan

export const register = async (req: Request, res: Response) => {
  // Relying entirely on our Zod validator to have pre-cleaned req.body input safely
  const user = await authService.registerUser(req.body);
  
  res.status(201).json({
    status: 'success',
    data: { user },
  });
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  // Bind the tokens securely directly to the HTTP cookie payload jars
  res.cookie('accessToken', result.accessToken, { ...cookieOptions, maxAge: ACCESS_COOKIE_MAX_AGE });
  res.cookie('refreshToken', result.refreshToken, { ...cookieOptions, maxAge: REFRESH_COOKIE_MAX_AGE });

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully',
    data: { userId: result.userId, username: result.username },
  });
};

export const logout = async (req: Request, res: Response) => {
  // If they have an active refresh token cookie, let's look up their user ID and revoke the session
  const token = req.cookies.refreshToken;
  
  if (token) {
    try {
      // Decode the token properties to locate the target user ID row to wipe
      const { verifyRefreshToken } = require('../utils/authUtils');
      const decoded = verifyRefreshToken(token);
      await authService.logoutUser(decoded.userId);
    } catch (_) {
      // If token is malformed/expired, ignore and proceed to clear client cookies anyway
    }
  }

  // Clear cookie jars on the client side instantly
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

export const refresh = async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  const result = await authService.refreshSession(incomingRefreshToken);

  // Push the newly minted access token right into the client cookie jar
  res.cookie('accessToken', result.newAccessToken, { ...cookieOptions, maxAge: ACCESS_COOKIE_MAX_AGE });

  res.status(200).json({
    status: 'success',
    message: 'Token refreshed successfully',
  });
};