import cors from 'cors';
import express, { Express } from 'express';
import { env } from './config/env.config.js';
import { authRouter } from './features/auth/auth.routes.js';
import { globalErrorHandler } from './middlewares/global-error.middleware.js';

const app: Express = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// 2. Health Check (Crucial for Docker/Kubernetes)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

app.get('/', (req, res) => {
  res.send('Auth Service is running!');
});

// Routes
app.use('/api/v1/auth', authRouter);

// 4. Global Error Handler (Must be last)
app.use(globalErrorHandler);

export { app };
