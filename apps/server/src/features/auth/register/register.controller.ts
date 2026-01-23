import { sendSuccess } from '@/utils/response.utils.js';
import { NextFunction, Request, Response } from 'express';
import { RegisterService } from './register.service.js';

const registerService = new RegisterService();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await registerService.execute(req.body);

    return sendSuccess(res, {
      message: 'Registration successful. Please verify your email.',
      data: result.user,
      statusCode: 201,
    });
  } catch (err) {
    next(err);
  }
};
