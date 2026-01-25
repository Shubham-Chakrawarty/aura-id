import fs from 'node:fs';
import path from 'node:path';

export const authConfig = {
  issuer: 'aura-id.com',
  accessTokenExpiresInMinutes: 15,
  refreshTokenExpiresInDays: 7,

  // Security: Key Management
  keys: {
    _cache: new Map<string, string>(),

    _loadKey(fileName: string): string {
      if (this._cache.has(fileName)) return this._cache.get(fileName)!;

      const keyPath = path.resolve(import.meta.dirname, '../../keys', fileName);

      try {
        const key = fs.readFileSync(keyPath, 'utf8');
        this._cache.set(fileName, key);
        return key;
      } catch (error) {
        console.error(`Fatal: Key not found at ${keyPath}`, error);
        process.exit(1);
      }
    },

    get privateKey() {
      return this._loadKey('private.pem');
    },
    get publicKey() {
      return this._loadKey('public.pem');
    },
  },
} as const;
