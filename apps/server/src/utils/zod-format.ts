import { ZodError } from 'zod';

export const formatZodError = (error: ZodError) => {
  // Turns ['address', 'street'] into 'address.street'
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
};
