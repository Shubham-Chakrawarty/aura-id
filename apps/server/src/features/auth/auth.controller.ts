// apps/server/src/features/auth/auth.controller.ts
import { env } from '@/config/env.config.js';
import { sendSuccess } from '@/utils/response.utils.js';
import { LoginRequest, RegisterRequest } from '@aura/shared';
import { NextFunction, Request, Response } from 'express';
import { loginService } from './login.service.js';
import { registerService } from './register.service.js';

export class AuthController {
  constructor(
    private readonly _loginService: typeof loginService,
    private readonly _registerService: typeof registerService,
  ) {}

  // POST /auth/register
  register = async (
    req: Request<Record<string, never>, unknown, RegisterRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this._registerService.execute(req.body);

      return sendSuccess(res, {
        message: 'Account created. Please verify your email to continue.',
        data: result,
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
      // Get connection metadata
      const clientIp = req.ip || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      const authResult = await this._loginService.execute(req.body, {
        ip: clientIp,
        userAgent,
      });

      // 1. Handle Consent Flow (Multi-Context Blueprint)
      if (authResult.status === 'CONSENT_REQUIRED') {
        return sendSuccess(res, {
          message:
            'Authentication successful. Consent required for this application.',
          data: authResult.data, // Contains userId, clientId, requestedScopes
        });
      }

      // 2. Handle Success Flow
      const { user, accessToken, refreshToken, expiresAt } = authResult.data;

      // Set Security Cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/auth/refresh', // Senior Tip: Restrict cookie sent path for better security
      });

      return sendSuccess(res, {
        message: 'Login successful',
        data: {
          user, // The SafeUser (with context)
          accessToken, // The short-lived JWT
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController(loginService, registerService);
