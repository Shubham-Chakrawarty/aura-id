import { authConfig } from '@/config/auth.config.js';
import { prisma } from '@aura/database';
import { generateRefreshToken } from './token.service.js';

export const createSession = async (
  userId: string,
  clientId: string,
  userAgent: string,
  ipAddress: string,
) => {
  const refreshToken = await generateRefreshToken(userId, clientId);

  const days = authConfig.refreshTokenExpiresInDays;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  await prisma.refreshToken.upsert({
    where: {
      userId_clientId_userAgent: {
        userId,
        clientId,
        userAgent,
      },
    },
    update: {
      token: refreshToken,
      ipAddress,
      expiresAt,
      isRevoked: false,
    },
    create: {
      token: refreshToken,
      userId,
      clientId,
      userAgent,
      ipAddress,
      expiresAt,
    },
  });

  return { refreshToken, expiresAt };
};
