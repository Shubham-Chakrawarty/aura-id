import crypto from 'node:crypto';
import { createSessionWithToken } from './session.repository.js';

type CreateSessionParams = {
  userId: string;
  applicationId: string;
  membershipId: string;
  context: { userAgent: string; ip: string };
};

export class SessionService {
  async create(params: CreateSessionParams) {
    // 1. Destructure params to make the code cleaner
    const { userId, applicationId, membershipId, context } = params;

    // 2. Business Logic: Generate the identifiers
    const sid = `sid_${crypto.randomBytes(16).toString('hex')}`;
    const tokenString = crypto.randomBytes(40).toString('hex');

    // 3. Set Expiry (7 Days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // 4. Data Access: Delegate to Repo
    // Fixed: Used correct object property mapping
    const { session, refreshToken } = await createSessionWithToken({
      userId,
      applicationId,
      membershipId,
      sid,
      tokenString,
      userAgent: context.userAgent,
      ipAddress: context.ip,
      expiresAt,
    });

    // 5. Return only what the caller needs
    return {
      sid: session.sid,
      refreshToken: refreshToken.token,
      expiresAt: session.expiresAt,
    };
  }
}

export const sessionService = new SessionService();
