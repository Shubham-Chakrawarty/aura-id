import { dbOperation } from '@/utils/prisma.utils.js';
import { prisma } from '@aura/database';

export async function findMembership(userId: string, clientId: string) {
  return await dbOperation(() =>
    prisma.applicationMembership.findFirst({
      where: {
        userId,
        deletedAt: null,
        application: {
          clientId,
          deletedAt: null,
        },
      },
      include: {
        application: true,
      },
    }),
  );
}
