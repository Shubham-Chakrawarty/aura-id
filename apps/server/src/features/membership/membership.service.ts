import { AppError } from '@/utils/error.utils.js';
import { membershipRepository } from './membership.repository.js';

export class MembershipService {
  constructor(private readonly _membershipRepo: typeof membershipRepository) {}

  checkAccess = async (userId: string, clientId: string) => {
    const membership = await this._membershipRepo.findMembership(
      userId,
      clientId,
    );

    // 1. Hand-off: User exists but has no "Visa" yet
    if (!membership) return null;

    // 2. Exception: User is explicitly blocked (Throw)
    if (membership.status === 'BANNED') {
      throw new AppError('Access denied', 403, 'USER_BANNED');
    }

    if (membership.status !== 'ACTIVE') {
      throw new AppError('Membership inactive', 403, 'MEMBERSHIP_DISABLED');
    }

    // 3. Happy Path: Return the data
    return {
      membership,
      application: membership.application,
    };
  };
}

export const membershipService = new MembershipService(membershipRepository);
