import { env } from '@/config/env.config.js';
import { sendSuccess } from '@/utils/response.utils.js';
import { LoginRequest, RegisterRequest } from '@aura/shared';
import { NextFunction, Request, Response } from 'express';
import { loginService } from './login.service.js';
import { registerService } from './register.service.js';

export class AuthController {
  // POST /auth/register
  register = async (
    req: Request<Record<string, never>, unknown, RegisterRequest>,
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

  // POST /auth/login
  login = async (
    req: Request<Record<string, never>, unknown, LoginRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { status, data } = await loginService.execute(req.body, {
        ip: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      });

      // Return Consent Requirement Response
      if (status === 'CONSENT_REQUIRED') {
        return sendSuccess(res, {
          message: 'User authenticated, but app consent is missing.',
          data: {
            userId: data.userId,
            clientId: data.clientId,
            requestedScopes: data.requestedScopes,
          },
        });
      }

      // Set HttpOnly Cookie for Refresh Token
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: data.expiresAt,
      });

      // Return Access Token and User Info
      return sendSuccess(res, {
        message: 'Login successful',
        data: { user: data.user, accessToken: data.accessToken },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
