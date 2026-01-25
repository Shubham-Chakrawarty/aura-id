import { dbOperation } from '@/utils/prisma.utils.js';
import { prisma } from '@aura/database';

export interface CreateIdentityDTO {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  appClientId: string;
  role: string;
}

export async function createIdentityWithMembership(data: CreateIdentityDTO) {
  return await dbOperation(() =>
    prisma.$transaction(async (tx) => {
      const application = await tx.application.findUnique({
        where: { clientId: data.appClientId },
        select: { id: true },
      });

      if (!application) return null;

      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          firstName: data.firstName,
          lastName: data.lastName,
          passwordHash: data.passwordHash,
          avatarUrl: data.avatarUrl,
        },
      });

      const membership = await tx.applicationMembership.create({
        data: {
          userId: user.id,
          applicationId: application.id,
          role: data.role,
        },
      });

      return { user, membership };
    }),
  );
}

export async function findUserByEmail(email: string) {
  return await dbOperation(() =>
    prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { memberships: true },
    }),
  );
}
