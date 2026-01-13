import { validateBody } from '@/middlewares/validateBody.middleware.js';
import { loginRequestSchema, registerRequestSchema } from '@aura/shared/auth';
import { Router } from 'express';
import { login } from './login/login.controller.js';
import { register } from './register/register.controller.js';

export const authRouter: Router = Router();

authRouter.post('/register', validateBody(registerRequestSchema), register);
authRouter.post('/login', validateBody(loginRequestSchema), login);
