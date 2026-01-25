import { ApplicationMembership, User } from '@aura/database';
import { getFallbackAvatar, SafeUser, SafeUserWithContext } from '@aura/shared';

export function toSafeUser(
  user: User,
  membership?: ApplicationMembership | null,
): SafeUser | SafeUserWithContext {
  const userMetaData = (user.metadata as Record<string, unknown>) || {};

  // 1. Map the Global Identity
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

  // 2. If no membership, return early (The Human only)
  if (!membership) return safeUser;

  // 3. Attach Context (The Visa)
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
