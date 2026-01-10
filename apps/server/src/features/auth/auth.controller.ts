import { sendSuccess } from '@/utils/response.js';
import { RegisterBaseInput } from '@aura/shared/auth';
import { NextFunction, Request, Response } from 'express';
import { toSafeUser } from '../user/user.mapper.js';
import { registerUser } from './register.service.js';

export const registerHandler = async (
  req: Request<Record<string, never>, unknown, RegisterBaseInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const { user } = await registerUser({
      email,
      password,
      firstName,
      lastName,
    });
    return sendSuccess(res, {
      message: 'Registration successful. Please verify your email.',
      data: toSafeUser(user),
      statusCode: 201,
    });
  } catch (err) {
    next(err);
  }
};
