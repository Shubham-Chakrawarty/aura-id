import { env } from '@/config/env.config.js';
import { sendSuccess } from '@/utils/response.utils.js';
import { LoginRequest } from '@aura/shared';
import { NextFunction, Request, Response } from 'express';
import { loginUser } from './login.service.js';

export const login = async (
  req: Request<Record<string, never>, unknown, LoginRequest>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password, clientId } = req.body;

    const { user, accessToken, refreshToken, expiresAt } = await loginUser(
      { email, password, clientId },
      {
        userAgent: req.header('user-agent') || 'unknown',
        ip: req.ip || 'unknown',
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
    });

    return sendSuccess(res, {
      message: 'Login successful',
      data: { user, accessToken },
    });
  } catch (err) {
    next(err);
  }
};
