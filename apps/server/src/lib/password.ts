import argon2 from 'argon2';

export const hashPassword = async (password: string) => {
  return await argon2.hash(password, { type: argon2.argon2id });
};

export const verifyPassword = async (
  hashedPassword: string,
  plainPassword: string,
) => {
  return await argon2.verify(hashedPassword, plainPassword);
};
