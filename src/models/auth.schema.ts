import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string({ 
      error: (issue) => issue.input === undefined ? 'Username is required' : 'Username must be a valid string' 
    })
      .min(3, { error: 'Username must be at least 3 characters long' })
      .max(30, { error: 'Username cannot exceed 30 characters' })
      .trim(),
    
    email: z.email({ error: 'Invalid email address' })
      .trim()
      .lowercase(),
    
    password: z.string({ 
      error: (issue) => issue.input === undefined ? 'Password is required' : 'Password must be a valid string' 
    })
      .min(8, { error: 'Password must be at least 8 characters long' })
      .max(100, { error: 'Password is too long' }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ error: 'Invalid email address' }).trim().lowercase(),
    password: z.string({ 
      error: (issue) => issue.input === undefined ? 'Password is required' : 'Password must be a valid string' 
    }),
  }),
});