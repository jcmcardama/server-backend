import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '../utils/appError';

export const validate = (schema: ZodObject<any>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join('.').replace(/^(body|query|params)\./, ''), 
          message: err.message,
        }));

        const appError = new AppError('Validation Failed', 400);
        (appError as any).errors = formattedErrors;
        
        return next(appError);
      }
      
      next(error);
    }
  };
};