import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../utils/appError';
import { verifyAccessToken } from '../utils/authUtils';
import { prisma } from '../config/db';

export const protect: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Pull the short-lived access token out of our secure cookie jar
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new AppError('You are not logged in. Please log in to gain access.', 401));
  }

  try {
    // 2. Cryptographically verify that the token string hasn't been tampered with
    const decoded = verifyAccessToken(accessToken);

    // 3. Confirm the user still exists in our PostgreSQL database (in case they were recently deleted)
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4. Securely strip out the hashed password so it never accidentally leaks downstream
    const { password, ...userWithoutPassword } = currentUser;

    // 5. Grant access by mounting the user record straight onto the request object
    req.user = userWithoutPassword;
    
    next();
  } catch (error) {
    // If jwt.verify throws an error (e.g., token expired or invalid signature), handle it cleanly
    return next(new AppError('Invalid or expired access token. Please refresh your session.', 401));
  }
};