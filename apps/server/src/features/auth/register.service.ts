import { AppError } from '@/utils/error.utils.js';
import { hashString } from '@aura/database';
import { RegisterRequest } from '@aura/shared';
import { toSafeUser } from '../user/user.mapper.js';
import { userRepository } from '../user/user.repository.js';

export class RegisterService {
  constructor(private readonly _userRepo: typeof userRepository) {}

  execute = async (data: RegisterRequest) => {
    const passwordHash = await hashString(data.password);
    const reponse = await this._userRepo.createWithMembership({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: data.avatarUrl,
      appClientId: data.clientId,
      role: 'USER',
    });

    if (!reponse)
      throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');

    return toSafeUser(reponse.user, reponse.membership);
  };
}

export const registerService = new RegisterService(userRepository);
