import { validate } from '@/middlewares/validate.middleware.js';
import { registerBaseSchema } from '@aura/shared/auth';
import { Router } from 'express';
import { registerHandler } from './auth.controller.js';

export const authRouter: Router = Router();

authRouter.post('/register', validate(registerBaseSchema), registerHandler);
