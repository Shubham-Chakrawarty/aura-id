import { dbOperation } from '@/utils/prisma.utils.js';
import { prisma } from '@aura/database';

interface CreateSessionDTO {
  sid: string;
  userId: string;
  applicationId: string;
  membershipId: string;
  tokenString: string;
  userAgent: string;
  ipAddress: string;
  expiresAt: Date;
}

export async function createSessionWithToken(params: CreateSessionDTO) {
  return await dbOperation(() =>
    prisma.$transaction(async (tx) => {
      // 1. Create the Session (The parent container)
      const session = await tx.session.create({
        data: {
          sid: params.sid,
          userId: params.userId,
          applicationId: params.applicationId,
          membershipId: params.membershipId,
          userAgent: params.userAgent,
          ipAddress: params.ipAddress,
          expiresAt: params.expiresAt,
        },
      });

      // 2. Create the Refresh Token (The actual credential)
      const refreshToken = await tx.refreshToken.create({
        data: {
          token: params.tokenString,
          userId: params.userId,
          applicationId: params.applicationId,
          sessionId: session.id,
          expiresAt: params.expiresAt,
        },
      });

      return { session, refreshToken };
    }),
  );
}

export async function revokeSession(sid: string) {
  return await dbOperation(() =>
    prisma.$transaction(async (tx) => {
      const session = await tx.session.update({
        where: { sid },
        data: { revokedAt: new Date() },
      });

      await tx.refreshToken.updateMany({
        where: { sessionId: session.id },
        data: { revokedAt: new Date() },
      });

      return session;
    }),
  );
}

export async function deleteSession(sid: string) {
  return await dbOperation(() =>
    prisma.$transaction(async (tx) => {
      const session = await tx.session.update({
        where: { sid },
        data: { deletedAt: new Date() },
      });

      // Also hide the tokens
      await tx.refreshToken.updateMany({
        where: { sessionId: session.id },
        data: { deletedAt: new Date() },
      });

      return session;
    }),
  );
}
