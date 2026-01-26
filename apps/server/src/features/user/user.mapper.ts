import { getFallbackAvatar } from '@/utils/avatar.utils.js';
import { ApplicationMembership, User } from '@aura/database';
import { SafeUser, SafeUserWithContext } from '@aura/shared';

export function toSafeUser(
  user: User,
  membership?: ApplicationMembership | null,
): SafeUser | SafeUserWithContext {
  const userMetaData = (user.metadata as Record<string, unknown>) || {};

  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    avatarUrl:
      user.avatarUrl ?? getFallbackAvatar(user.firstName, user.lastName),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    metadata: userMetaData,
  };

  if (!membership) return safeUser;

  return {
    ...safeUser,
    context: {
      id: membership.id,
      role: membership.role,
      metadata: (membership.metadata as Record<string, unknown>) || {},
      joinedAt: membership.createdAt,
    },
  };
}
