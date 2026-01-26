import { authConfig } from '@/config/auth.config.js';
import { importPKCS8, SignJWT } from 'jose';

export class TokenService {
  constructor(private readonly _authConfig: typeof authConfig) {}

  generateAccess = async (params: {
    userId: string;
    sid: string;
    mid: string;
    role: string;
  }) => {
    // 1. Convert PEM string to a CryptoKey object
    const privateKey = await importPKCS8(
      this._authConfig.keys.privateKey,
      'RS256',
    );

    // 2. Sign and return
    return new SignJWT({
      sid: params.sid,
      mid: params.mid,
      role: params.role,
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuedAt()
      .setIssuer(this._authConfig.issuer)
      .setSubject(params.userId)
      .setExpirationTime('15m')
      .sign(privateKey);
  };
}

export const tokenService = new TokenService(authConfig);
