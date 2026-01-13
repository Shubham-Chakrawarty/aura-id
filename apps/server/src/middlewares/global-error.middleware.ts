import { env } from '@/config/env.config.js';
import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  err: Error & { statusCode?: number; code?: string; details?: unknown },
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'INTERNAL_ERROR';

  if (statusCode === 500) {
    console.error('❌ CRITICAL ERROR:', err);
    message = 'Something went wrong on our end';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details: err.details || null,
      // Only show stack trace in development mode!
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl, // Useful for the frontend to know which URL failed
    },
  });
};
