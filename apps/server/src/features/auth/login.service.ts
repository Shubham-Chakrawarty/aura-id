import { updateUserAudit } from '@/features/user/user.repository.js';
import { AppError } from '@/utils/error.utils.js';
import { LoginRequest } from '@aura/shared';
import { membershipService } from '../membership/membership.service.js';
import { toSafeUser } from '../user/user.mapper.js';
import { authService } from './auth.service.js';
import { sessionService } from './shared/session.service.js';
import { tokenService } from './shared/token.service.js';

export class LoginService {
  async execute(
    data: LoginRequest,
    context: { userAgent: string; ip: string },
  ) {
    // Verify the user exists and password is correct
    const user = await authService.verifyCredentials(data.email, data.password);
    if (!user)
      throw new AppError(
        'Invalid email or password',
        401,
        'INVALID_CREDENTIALS',
      );

    // Check if the user has an active membership for the client
    const access = await membershipService.checkAccess(user.id, data.clientId);

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
      sessionService.create({
        userId: user.id,
        applicationId: application.id,
        membershipId: membership.id,
        context,
      }),
      updateUserAudit(user.id),
    ]);

    // Issue Credentials: JWT for short-term access
    const accessToken = tokenService.generateAccess({
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
  }
}

export const loginService = new LoginService();
