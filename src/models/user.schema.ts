import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string()
      .min(3, { error: 'Username must be at least 3 characters long' })
      .max(30, { error: 'Username cannot exceed 30 characters' })
      .trim()
      .optional(),
    email: z.email({ error: 'Invalid email address' })
      .trim()
      .lowercase()
      .optional(),
  }),
});