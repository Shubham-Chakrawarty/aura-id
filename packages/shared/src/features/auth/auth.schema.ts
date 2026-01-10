import z from 'zod';
import {
  emailSchema,
  nameSchema,
  passwordSchema,
  strongPasswordSchema,
} from '../../primitives/index.js';

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerBaseSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: strongPasswordSchema,
});

// Signup Schema
export const registerSchema = registerBaseSchema
  .extend({
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
