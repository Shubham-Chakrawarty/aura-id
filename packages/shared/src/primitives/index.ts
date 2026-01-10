import { z } from 'zod';

// Name Schema
export const nameSchema = z.string().min(2, 'Must be at least 2 characters');
export type NameInput = z.infer<typeof nameSchema>;

// Email schema
export const emailSchema = z
  .string()
  .email('Enter valid email (eg: johnDoe@gmail.com)');
export type EmailInput = z.infer<typeof emailSchema>;

// Password Schema
export const passwordSchema = z
  .string()
  .min(1, { message: 'Field cannot be empty' });
export type PasswordInput = z.infer<typeof passwordSchema>;

// Strong password schema
export const strongPasswordSchema = z
  .string()
  .min(8, 'Must be at least 8 characters')
  .regex(/[A-Z]/, { message: 'Include at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Include at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Include at least one number' })
  .regex(/[^A-Za-z0-9]/, { message: 'Include at least one special character' });
export type StrongPasswordInput = z.infer<typeof strongPasswordSchema>;
