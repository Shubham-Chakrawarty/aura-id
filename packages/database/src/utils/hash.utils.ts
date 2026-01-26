import argon2 from 'argon2';

const ARGON_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64MB
  timeCost: 3,
  parallelism: 4,
} as const;

export const hashString = async (plainText: string): Promise<string> => {
  if (!plainText) {
    throw new Error('Text is required for hashing');
  }
  return await argon2.hash(plainText, ARGON_CONFIG);
};

export const verifyHash = async (
  hash: string,
  plainText: string,
): Promise<boolean> => {
  if (!hash || !plainText) {
    return false;
  }

  try {
    return await argon2.verify(hash, plainText);
  } catch (error: unknown) {
    console.error('Error verifying hashed data:', error);
    return false;
  }
};
