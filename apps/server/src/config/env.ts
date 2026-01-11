import { formatZodError } from '@/utils/zod-format.js';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3001'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_SECRET: z.string().min(32),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const formattedErrors = formatZodError(parsedEnv.error);
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(formattedErrors, null, 2),
  );
  process.exit(1);
}

export const env = parsedEnv.data;
