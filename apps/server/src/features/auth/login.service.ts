import { AppError } from '@/utils/error.utils.js';
import { verifyHash } from '@aura/database';
import { LoginRequest } from '@aura/shared';
import { membershipService } from '../membership/membership.service.js';
import { toSafeUser } from '../user/user.mapper.js';
import { userRepository } from '../user/user.repository.js';
import { sessionService } from './shared/session.service.js';
import { tokenService } from './shared/token.service.js';

export class LoginService {
  constructor(
    private readonly _membershipService: typeof membershipService,
    private readonly _sessionService: typeof sessionService,
    private readonly _tokenService: typeof tokenService,
    private readonly _userRepo: typeof userRepository,
  ) {}

  execute = async (
    data: LoginRequest,
    context: { userAgent: string; ip: string },
  ) => {
    // Verify the user exists and password is correct
    const user = await this._userRepo.findByEmail(data.email);
    let isPasswordValid = false;

    if (user)
      isPasswordValid = await verifyHash(user.passwordHash, data.password);

    if (!user || !isPasswordValid)
      throw new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS',
      );

    // Check if the user has an active membership for the client
    const access = await this._membershipService.checkAccess(
      user.id,
      data.clientId,
    );

    // Return Success with Consent Required
    if (!access) {
      return {
        status: 'CONSENT_REQUIRED' as const,
        message: 'User authenticated, but app consent is missing',
        data: {
          userId: user.id,
          clientId: data.clientId,
          requestedScopes: data.scopes,
        },
      };
    }

    const { application, membership } = access;

    // Audit & Session: Parallelize for performance
    const [session] = await Promise.all([
      this._sessionService.create({
        userId: user.id,
        applicationId: application.id,
        membershipId: membership.id,
        context,
      }),
      this._userRepo.updateLastLogin(user.id),
    ]);

    // Issue Credentials: JWT for short-term access
    const accessToken = this._tokenService.generateAccess({
      userId: user.id,
      sid: session.sid,
      mid: membership.id,
      role: membership.role,
    });

    return {
      status: 'SUCCESS' as const,
      data: {
        user: toSafeUser(user, membership),
        accessToken,
        refreshToken: session.refreshToken,
        expiresAt: session.expiresAt,
      },
    };
  };
}

export const loginService = new LoginService(
  membershipService,
  sessionService,
  tokenService,
  userRepository,
);
