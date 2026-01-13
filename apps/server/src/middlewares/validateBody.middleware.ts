import { AppError } from '@/utils/app-error.js';
import { formatZodError } from '@/utils/zod-format.js';
import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

export const validateBody = <T>(schema: ZodType<T>) => {
  return async (
    req: Request<Record<string, never>, unknown, T>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = formatZodError(error);
        return next(
          new AppError('Validation Failed', 400, 'VALIDATION_ERROR', details),
        );
      } else {
        next(error);
      }
    }
  };
};
