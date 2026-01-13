import { toSafeUser } from '@/features/user/user.mapper.js';
import { sendSuccess } from '@/utils/response.js';
import { RegisterRequest } from '@aura/shared/auth';
import { NextFunction, Request, Response } from 'express';
import { registerUser } from './register.service.js';

export const register = async (
  req: Request<Record<string, never>, unknown, RegisterRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      clientId,
      metadata,
      avatarUrl,
    } = req.body;
    const { user } = await registerUser({
      email,
      password,
      firstName,
      lastName,
      clientId,
      metadata,
      avatarUrl,
    });
    return sendSuccess(res, {
      message: 'Registration successful. Please verify your email.',
      data: toSafeUser(user, clientId),
      statusCode: 201,
    });
  } catch (err) {
    next(err);
  }
};
