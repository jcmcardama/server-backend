import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { AppError } from './utils/appError';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';

const app: Application = express();

// 1. Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' })); 
app.use(cookieParser()); 

// 2. Mount API Application Feature Handlers
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// 3. Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy!' });
});

// 4. Fallback Route for Undefined Paths
app.all('/{*splat}', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 5. Global Centralized Error Handler
app.use(errorHandler);

export default app;