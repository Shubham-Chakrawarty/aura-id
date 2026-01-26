import { config } from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

// Load .env from the current package's directory
config({ path: resolve(import.meta.dirname, '../../.env') });
config({ path: resolve(import.meta.dirname, '../../../../.env') });

const serverEnvSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  FRONTEND_URL: z.url().min(1, 'FRONTEND_URL is required'),
});

export const env = serverEnvSchema.parse(process.env);
