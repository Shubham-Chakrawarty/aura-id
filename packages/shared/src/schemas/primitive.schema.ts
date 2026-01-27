import validator from 'validator';
import { z } from 'zod';

export const nameSchema = z
  .string('Name is required')
  .trim()
  .min(2, 'Name is too short')
  .max(50, 'Name is too long')
  .transform((value) => validator.escape(value));

export const emailSchema = z
  .email('Enter a valid email (eg: john.doe@gmail.com)')
  .trim()
  .transform(
    (val) =>
      validator.normalizeEmail(val, {
        gmail_remove_dots: true,
        gmail_remove_subaddress: true,
        outlookdotcom_remove_subaddress: true,
        all_lowercase: true,
        icloud_remove_subaddress: true,
      }) || val.toLowerCase(),
  );

// Simple Password Schema (For Login)
export const passwordSchema = z
  .string('Password is required')
  .min(1, 'Must be at least 1 character')
  .max(100, 'Password too long');

// Strong Password Schema (For Registration)
export const strongPasswordSchema = z
  .string('Password is required')
  .min(8, 'Must be at least 8 characters')
  .max(100, 'Password too long') // Security best practice
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[0-9]/, 'Include at least one number')
  .regex(/[^A-Za-z0-9]/, 'Include at least one special character');

export const urlSchema = z.url('Enter a valid URL');
