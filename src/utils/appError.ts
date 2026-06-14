export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // 4xx statuses are "fails", 5xx statuses are internal server "errors"
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // This flags the error as a known operational error so we can safely share details with the client
    this.isOperational = true;

    // Captures the stack trace, excluding this constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }
}