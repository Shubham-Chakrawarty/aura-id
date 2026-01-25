import z from 'zod';
import {
  loginRequestSchema,
  registerFormSchema,
  registerRequestSchema,
} from '../schemas/auth.schema.js';

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
