import z from 'zod';
import {
  loginSchema,
  registerBaseSchema,
  registerSchema,
} from './auth.schema.js';

export type LoginInput = z.infer<typeof loginSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;

export type RegisterBaseInput = z.infer<typeof registerBaseSchema>;
