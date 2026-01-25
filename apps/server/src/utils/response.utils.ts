import { SuccessApiResponse } from '@aura/shared';
import { Response } from 'express';

type SucessOptions<T> = {
  message: string;
  data: T;
  statusCode?: number;
  meta?: Record<string, unknown>;
};

export const sendSuccess = <T>(res: Response, options: SucessOptions<T>) => {
  const { message, data, statusCode = 200, meta = {} } = options;

  const payload: SuccessApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };

  return res.status(statusCode).json(payload);
};
