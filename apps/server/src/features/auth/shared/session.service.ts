import crypto from 'node:crypto';
import { sessionRepository } from './session.repository.js';

type CreateSessionParams = {
  userId: string;
  applicationId: string;
  membershipId: string;
  context: { userAgent: string; ip: string };
};

export class SessionService {
  constructor(private readonly _sessionRepo: typeof sessionRepository) {}

  create = async (params: CreateSessionParams) => {
    const { userId, applicationId, membershipId, context } = params;

    const sid = `sid_${crypto.randomBytes(16).toString('hex')}`;
    const tokenString = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const { session, refreshToken } = await this._sessionRepo.createWithToken({
      userId,
      applicationId,
      membershipId,
      sid,
      tokenString,
      userAgent: context.userAgent,
      ipAddress: context.ip,
      expiresAt,
    });

    return {
      sid: session.sid,
      refreshToken: refreshToken.token,
      expiresAt: session.expiresAt,
    };
  };
}

export const sessionService = new SessionService(sessionRepository);
