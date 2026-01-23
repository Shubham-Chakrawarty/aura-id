import { AppError } from '@/utils/error.utils.js';
import { formatZodError } from '@aura/shared';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError, ZodType } from 'zod';

export const validateBody = <T>(schema: ZodType<T>): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction) => {
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
      }

      next(error);
    }
  };
};
