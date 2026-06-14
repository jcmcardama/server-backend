import { User } from '../generated/prisma/client';

declare global {
  namespace Express {
    interface Request {
      // We attach the full user record (excluding password is best practice, but typed here)
      user?: Omit<User, 'password'>;
    }
  }
}