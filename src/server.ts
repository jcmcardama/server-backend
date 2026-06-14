import app from './app';
import 'dotenv/config';

// Catch synchronous bugs that weren't caught anywhere else (e.g., a typo on an undefined variable)
process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Catch asynchronous promise rejections (e.g., database connection dropping)
process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down gracefully...');
  console.error(err?.name, err?.message);
  server.close(() => {
    process.exit(1);
  });
});