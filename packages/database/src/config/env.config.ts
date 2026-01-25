import { config } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

config({ path: resolve(import.meta.dirname, '../../.env') });

export const envSchema = z.object({
  // Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Database (Infrastructure)
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is missing')
    .startsWith(
      'postgresql://',
      'DATABASE_URL must be a valid PostgreSQL connection string',
    ),

  // Auth Portal Configuration
  AUTH_PORTAL_CLIENT_ID: z.string().min(1, 'Auth Portal cannot be empty'),
  AUTH_PORTAL_REDIRECT_URI: z.url('Invalid Auth Portal Redirect URL'),

  // Admin Portal Configuration
  ADMIN_PORTAL_CLIENT_ID: z.string().min(1, 'Admin Portal cannot be empty'),
  ADMIN_PORTAL_REDIRECT_URI: z.url('Invalid Admin Portal Redirect URL'),
  ADMIN_PORTAL_SECRET: z
    .string()
    .min(32, 'ADMIN_PORTAL_SECRET must be at least 32 characters for security'),

  // Admin User Credentials
  ADMIN_EMAIL: z.email('Invalid Admin Email address'),
  ADMIN_PASSWORD: z
    .string()
    .min(12, 'Initial admin password must be at least 12 characters'),
});

export const env = envSchema.parse(process.env);
