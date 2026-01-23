import { z } from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  strongPasswordSchema,
  urlSchema,
} from '../../primitives/primitive.schema.js';

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  // Security Boundary (The "Visa" application)
  clientId: z.string().min(1, 'Client ID is required'),
});

export const registerRequestSchema = z.object({
  // Global Identity Fields
  email: emailSchema,
  password: strongPasswordSchema,
  firstName: nameSchema,
  lastName: nameSchema,

  // Security Boundary (The "Visa" application)
  clientId: z.string().min(1, 'Client ID is required'),

  // Optional extras
  avatarUrl: urlSchema.optional(),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

// For the Frontend (Auth Portal)
export const registerFormSchema = registerRequestSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
