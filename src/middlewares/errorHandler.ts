import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err instanceof AppError || err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(err.errors && { errors: err.errors })
      });
    } else {
      console.error('CRITICAL ERROR:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong on our end.',
      });
    }
  }
};