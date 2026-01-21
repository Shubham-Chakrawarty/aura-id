import { authConfig } from '@/config/auth.config.js';
import { prisma } from '@aura/database';
import crypto from 'node:crypto';
import { generateRefreshToken } from './token.service.js';

export const createSession = async (
  userId: string,
  applicationId: string,
  userAgent: string,
  ipAddress: string,
) => {
  // 1. Find the "Visa" (Membership) for this specific App
  const membership = await prisma.applicationMembership.findUnique({
    where: {
      userId_applicationId: { userId, applicationId },
    },
  });

  if (!membership) {
    throw new Error('User does not have a membership for this application.');
  }

  const tokenString = await generateRefreshToken(userId, applicationId);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + authConfig.refreshTokenExpiresInDays);

  // 2. Execute the Atomic Transaction
  return await prisma.$transaction(async (tx) => {
    // Create the 'Keycard' (Session)
    const session = await tx.session.create({
      data: {
        sid: `sid_${crypto.randomBytes(16).toString('hex')}`,
        userId,
        applicationId,
        membershipId: membership.id, // Linked for the Quadruple Check
        userAgent,
        ipAddress,
        expiresAt, // Session also needs an expiry (usually matches Refresh Token)
      },
    });

    // Create the 'Battery' (RefreshToken)
    const refreshToken = await tx.refreshToken.create({
      data: {
        token: tokenString,
        userId,
        applicationId,
        sessionId: session.id,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return {
      sid: session.sid,
      refreshToken: refreshToken.token,
      expiresAt,
    };
  });
};
