import { validateBody } from '@/middlewares/validate-body.middleware.js';
import { loginRequestSchema, registerRequestSchema } from '@aura/shared';
import { Router } from 'express';
import { authController } from './auth.controller.js';

export const authRouter: Router = Router();

authRouter.post(
  '/register',
  validateBody(registerRequestSchema),
  authController.register,
);
authRouter.post(
  '/login',
  validateBody(loginRequestSchema),
  authController.login,
);
