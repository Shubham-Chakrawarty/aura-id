import { z, ZodType } from 'zod';
import { formatZodError } from './zod.utils.js';

export function validateEnv<T extends ZodType>(
  schema: T,
  envSource = process.env,
): z.infer<T> {
  const parsed = schema.safeParse(envSource);

  if (!parsed.success) {
    const formattedErrors = formatZodError(parsed.error);

    console.error('❌ [Environment Validation Failed]');
    console.error(JSON.stringify(formattedErrors, null, 2));

    // Kill the process immediately to prevent the app from running in an unstable state.
    process.exit(1);
  }

  return parsed.data;
}
