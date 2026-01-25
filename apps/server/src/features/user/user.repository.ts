import { dbOperation } from '@/utils/prisma.utils.js';
import { prisma } from '@aura/database';

export const findUserByEmail = async (email: string) => {
  return await dbOperation(() =>
    prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    }),
  );
};

export const findUserWithMembership = async (
  email: string,
  clientId: string,
) => {
  return await dbOperation(() =>
    prisma.user.findFirst({
      where: { email, deletedAt: null },
      include: {
        memberships: {
          where: {
            application: {
              clientId: clientId,
              deletedAt: null,
            },
            deletedAt: null,
          },
        },
      },
    }),
  );
};

export const updateUserAudit = async (userId: string) => {
  return await dbOperation(() =>
    prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    }),
  );
};
