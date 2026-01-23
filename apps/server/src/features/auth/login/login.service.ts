import { toSafeUser } from '@/features/user/user.mapper.js';
import { findUserForApp } from '@/features/user/user.service.js';
import { AppError } from '@/utils/app-error.js';
import { prisma } from '@aura/database';
import { LoginRequest, verifyHash } from '@aura/shared';
import { createSession } from '../shared/session.service.js';
import { generateAccessToken } from '../shared/token.service.js';

export const loginUser = async (
  data: LoginRequest,
  context: { userAgent: string; ip: string },
) => {
  const { email, password, clientId } = data;

  const { user } = await verifyCredentials(email, password, clientId);

  prisma.user
    .update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
    .catch((err) => console.error('Audit update failed', err));

  // Orchestrate the session and tokens
  const { refreshToken, expiresAt } = await createSession(
    user.id,
    data.clientId,
    context.userAgent,
    context.ip,
  );
  const accessToken = await generateAccessToken(user.id, clientId);

  return {
    user: toSafeUser(user, clientId),
    accessToken,
    refreshToken,
    expiresAt,
  };
};

const verifyCredentials = async (
  email: string,
  password: string,
  clientId: string,
) => {
  // 1. Fetch user & check app-specific registration
  const response = await findUserForApp(email, clientId);

  if (!response?.user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const { user, isRegisteredForApp } = response;

  // 2. Verify Password
  const isPasswordValid = await verifyHash(user.passwordHash, password);

  // 3. Check both password AND if they belong to this app
  if (!isPasswordValid || !isRegisteredForApp) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return { user };
};
