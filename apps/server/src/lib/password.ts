import argon2 from 'argon2';

const ARGON_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64MB
  timeCost: 3,
  parallelism: 4,
} as const;

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error('Password is required for hashing');
  }
  return await argon2.hash(password, ARGON_CONFIG);
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> => {
  if (!hashedPassword || !plainPassword) {
    return false;
  }

  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error: unknown) {
    console.error('Error verifying password:', error);
    return false;
  }
};
