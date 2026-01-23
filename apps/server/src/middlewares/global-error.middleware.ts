import { env } from '@/config/env.config.js';
import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  err: Error & { statusCode?: number; code?: string; details?: unknown },
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const isCritical = statusCode === 500;

  if (isCritical) {
    console.error('❌ [CRITICAL]:', {
      name: err.name,
      message: err.message,
      body: req.body,
      path: req.originalUrl,
      stack: err.stack,
    });

    if (env.NODE_ENV === 'production') {
      err.message = 'Something went wrong on our end';
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message,
    error: {
      code: err.code || (isCritical ? 'INTERNAL_ERROR' : 'BAD_REQUEST'),
      details: err.details || null,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      requestId: req.headers['x-request-id'] || undefined,
    },
  });
};
