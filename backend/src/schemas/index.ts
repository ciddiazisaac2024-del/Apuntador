import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
  })
});

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['supervisor', 'ejecutivo'])
  })
});

export const caseSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    type: z.string().min(1, 'Type is required'),
    content: z.string().min(1, 'Content is required')
  })
});

export const searchScriptsSchema = z.object({
  query: z.object({
    name: z.string().min(1, 'Name query parameter is required')
  })
});
