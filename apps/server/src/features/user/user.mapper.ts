import { getAvatarConfig } from '@/utils/avatar.utils.js';
import { ApplicationMembership, User } from '@aura/database';
import { SafeUser, SafeUserWithMembership } from '@aura/shared';

export function toSafeUser(
  user: User,
  membership?: ApplicationMembership | null,
): SafeUser | SafeUserWithMembership {
  const safeUser: SafeUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isEmailVerified: user.isEmailVerified,
    avatar: getAvatarConfig(user.firstName, user.lastName),
    metadata: (user.metadata as Record<string, unknown>) || {},
    joinedAt: user.createdAt,
  };

  if (!membership) return safeUser;

  return {
    user: safeUser,
    membership: {
      id: membership.id,
      role: membership.role,
      metadata: (membership.metadata as Record<string, unknown>) || {},
      joinedAt: membership.createdAt,
    },
  };
}
