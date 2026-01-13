import { authConfig } from '@/config/auth.config.js';
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from 'jose';
import { randomUUID } from 'node:crypto';

const signToken = async (
  userId: string,
  expiresIn: string,
  claims: Record<string, unknown> = {},
  audience: string,
) => {
  const { privateKey: privateKeyString } = authConfig.getKeys();
  const privateKey = await importPKCS8(privateKeyString, 'RS256');

  return await new SignJWT({ ...claims })
    .setProtectedHeader({ alg: 'RS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setJti(randomUUID())
    .setIssuer(authConfig.issuer)
    .setAudience(audience)
    .setExpirationTime(expiresIn)
    .sign(privateKey);
};

export const generateAccessToken = async (userId: string, clientId: string) => {
  const audience = clientId;
  return await signToken(userId, authConfig.accessTokenExpires, {}, audience);
};

export const generateRefreshToken = async (
  userId: string,
  clientId: string,
) => {
  return await signToken(
    userId,
    authConfig.refreshTokenExpires,
    { cid: clientId },
    authConfig.issuer,
  );
};

export const verifyRefreshToken = async (token: string) => {
  const { publicKey: publicKeyString } = authConfig.getKeys();
  const publicKey = await importSPKI(publicKeyString, 'RS256');

  const { payload } = await jwtVerify(token, publicKey, {
    issuer: authConfig.issuer,
    audience: authConfig.issuer,
  });

  return payload;
};
