import { getFallbackAvatar, type SafeUser } from '@aura/shared';
import { User } from '../generated/prisma/client.js';

export const toSafeUser = (user: User, clientId: string): SafeUser => {
  const metadata = (user.metadata as Record<string, unknown>) || {};

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    avatarUrl:
      user.avatarUrl ?? getFallbackAvatar(user.firstName, user.lastName),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    appSettings: metadata[clientId] || {},
  };
};
