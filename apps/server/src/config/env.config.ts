import { validateEnv } from '@aura/shared';
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

// Load .env from the current package's directory
config({ path: resolve(import.meta.dirname, '../../.env') });

const serverEnvSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
});

export const env = validateEnv(serverEnvSchema, process.env);
