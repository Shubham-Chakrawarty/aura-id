import { AppError } from '@/utils/error.utils.js';
import { hashString, RegisterRequest } from '@aura/shared';
import { toSafeUser } from '../user/user.mapper.js';
import { createIdentityWithMembership } from './auth.repository.js';

export class RegisterService {
  async execute(data: RegisterRequest) {
    const passwordHash = await hashString(data.password);
    const result = await createIdentityWithMembership({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: data.avatarUrl,
      appClientId: data.clientId,
      role: 'USER',
    });

    if (!result)
      throw new AppError('Application not found', 400, 'APPLICATION_NOT_FOUND');

    return { user: toSafeUser(result.user, result.membership) };
  }
}

export const registerService = new RegisterService();
