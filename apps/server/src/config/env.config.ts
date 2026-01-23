import { validateEnv } from '@aura/shared';
import { z } from 'zod';

const serverEnvSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
});

export const env = validateEnv(serverEnvSchema);
