import fs from 'fs';
import path from 'path';

// Private variables to cache the keys in memory
let cachedPrivateKey: string;
let cachedPublicKey: string;

const loadKey = (fileName: string) => {
  const keyPath = path.join(process.cwd(), 'keys', fileName);
  return fs.readFileSync(keyPath, 'utf8');
};

export const authConfig = {
  issuer: 'aura-id',
  accessTokenExpires: '15m',
  refreshTokenExpiresInDays: 7,
  refreshTokenExpires: '7d',
  getKeys: () => {
    // Only read from disk if memory is empty
    if (!cachedPrivateKey || !cachedPublicKey) {
      cachedPrivateKey = loadKey('private.pem');
      cachedPublicKey = loadKey('public.pem');
    }
    return {
      privateKey: cachedPrivateKey,
      publicKey: cachedPublicKey,
    };
  },
};
