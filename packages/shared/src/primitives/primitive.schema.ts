import { z } from 'zod';

// Name Schema - Added max length to prevent "Buffer Overflow" style DB attacks
export const nameSchema = z
  .string()
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Name too long');

// Email schema - Added normalization
export const emailSchema = z
  .email('Enter valid email (eg: john.doe@gmail.com)')
  .trim()
  .toLowerCase();

// Simple Password Schema (For Login)
export const passwordSchema = z.string().min(1, 'Password is required');

// Strong Password Schema (For Registration)
export const strongPasswordSchema = z
  .string()
  .min(8, 'Must be at least 8 characters')
  .max(100, 'Password too long') // Security best practice
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[0-9]/, 'Include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character');

export const urlSchema = z.url('Enter a valid URL');
