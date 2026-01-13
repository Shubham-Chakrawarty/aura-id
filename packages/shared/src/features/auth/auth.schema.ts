import z from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  strongPasswordSchema,
} from '../../primitives/index.js';

// Login Request Schema
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  clientId: z.string().min(1, 'Client ID is required'),
});

// Register Request Schema
export const registerRequestSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
  clientId: z.string().min(1, 'Client ID is required'),
  metadata: z.record(z.string(), z.any()).optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
});

// Register Form Schema
export const registerFormSchema = registerRequestSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
