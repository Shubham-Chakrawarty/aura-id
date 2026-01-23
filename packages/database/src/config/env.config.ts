import { validateEnv } from '@aura/shared';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

config({ path: resolve(import.meta.dirname, '../../.env') });

const dbEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  AUTH_PORTAL_CLIENT_ID: z.string().min(1, 'AUTH_PORTAL_CLIENT_ID is required'),
  ADMIN_PORTAL_CLIENT_ID: z
    .string()
    .min(1, 'ADMIN_PORTAL_CLIENT_ID is required'),
  AUTH_PORTAL_REDIRECT_URI: z
    .url()
    .min(1, 'AUTH_PORTAL_REDIRECT_URI is required'),
  ADMIN_PORTAL_REDIRECT_URI: z
    .url()
    .min(1, 'ADMIN_PORTAL_REDIRECT_URI is required'),
  ADMIN_PORTAL_SECRET: z.string().min(1, 'ADMIN_PORTAL_SECRET is required'),
});

export const env = validateEnv(dbEnvSchema, process.env);
