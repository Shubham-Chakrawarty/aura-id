import { findUserByEmail } from '@/features/user/user.repository.js';
import { verifyHash } from '@aura/shared';

export class AuthService {
  async verifyCredentials(email: string, pass: string) {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isValid = await verifyHash(user.passwordHash, pass);
    if (!isValid) return null;

    return user;
  }
}

export const authService = new AuthService();
