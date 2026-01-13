import { SafeUser } from '@aura/shared/user';
import { User } from '@generated/prisma/index.js';

export const toSafeUser = (user: User, clientId: string): SafeUser => {
  const metadata = user.metadata as Record<string, unknown>;

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    avatarUrl:
      user.avatarUrl ??
      `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    appSettings: metadata[clientId] || {},
  };
};
