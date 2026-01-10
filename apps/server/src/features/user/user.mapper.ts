// apps/auth-service/src/features/user/user.mapper.ts
import { User } from '@/generated/prisma/client.js';
import { SafeUser } from '@aura/shared/user';

export const toSafeUser = (user: User): SafeUser => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
