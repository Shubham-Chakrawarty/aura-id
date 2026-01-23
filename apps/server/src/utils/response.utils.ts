import { Response } from 'express';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    timestamp: string;
  };
  error?: {
    title: string;
    details?: unknown;
  };
};

export const sendSuccess = <T>(
  res: Response,
  {
    message,
    data,
    statusCode = 200,
  }: {
    message: string;
    data?: T;
    statusCode?: number;
  },
) => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };

  return res.status(statusCode).json(responsePayload);
};
