import { validateBody } from '@/middlewares/validate-body.middleware.js';
import { registerRequestSchema } from '@aura/shared';
import { Router } from 'express';
import { register } from './register/register.controller.js';

export const authRouter: Router = Router();

authRouter.post('/register', validateBody(registerRequestSchema), register);
// authRouter.post('/login', validateBody(loginRequestSchema), login);
