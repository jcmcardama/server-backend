import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/appError';

const app: Application = express();

// 1. Global Middlewares
app.use(cors({
  origin: true, // For development; in production, lock this down to your specific frontend URL
  credentials: true, // Essential for allowing secure HTTP-only cookies to pass through
}));

app.use(express.json({ limit: '10kb' })); // Body parser, preventing large payload denial-of-service (DoS) attacks
app.use(cookieParser()); // Parses incoming cookies so we can read req.cookies

// 2. Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy!' });
});

// 3. Fallback Route for Undefined Paths
app.all('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4. Global Centralized Error Handler (Must be registered last!)
app.use(errorHandler);

export default app;