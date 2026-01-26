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

export const userRepository = {
  async createWithMembership(data: CreateIdentityDTO) {
    return await dbOperation(() =>
      prisma.$transaction(async (tx) => {
        const application = await tx.application.findUnique({
          where: { clientId: data.appClientId, deletedAt: null },
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
  },

  async findByEmail(email: string) {
    return await dbOperation(() =>
      prisma.user.findUnique({
        where: { email: email.toLowerCase(), deletedAt: null },
      }),
    );
  },

  async findWithMembership(email: string, clientId: string) {
    return await dbOperation(() =>
      prisma.user.findFirst({
        where: { email: email.toLowerCase(), deletedAt: null },
        include: {
          memberships: {
            where: {
              application: { clientId, deletedAt: null },
              deletedAt: null,
            },
            include: { application: true },
          },
        },
      }),
    );
  },

  async updateLastLogin(userId: string) {
    return await dbOperation(() =>
      prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      }),
    );
  },
};
