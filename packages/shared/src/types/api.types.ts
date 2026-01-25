interface BaseResponse {
  message: string;
  meta: {
    timestamp: string;
    [key: string]: unknown;
  };
}

export type SuccessApiResponse<T> = BaseResponse & {
  success: true;
  data: T;
  error?: never;
};

export type ErrorApiResponse = BaseResponse & {
  success: false;
  error: {
    code: string;
    details?: unknown;
    stack?: string;
  };
  data?: never;
};

export type ApiResponse<T = unknown> = SuccessApiResponse<T> | ErrorApiResponse;
