import { findUserByEmail } from '@/features/user/user.service.js';
import { hashPassword } from '@/lib/password.js';
import { prisma } from '@/lib/prisma.js';
import { AppError } from '@/utils/app-error.js';
import { RegisterBaseInput } from '@aura/shared/auth';

export const registerUser = async (data: RegisterBaseInput) => {
  const existingUser = await findUserByEmail(data.email);
  if (existingUser) {
    throw new AppError(
      'A user with this email address already exists.',
      409,
      'USER_ALREADY_EXISTS',
      { email: data.email },
    );
  }

  const newUser = await createUnverifiedUser(data);
  // TODO: Create email verification token and send verification email
  return { user: newUser };
};

export const createUnverifiedUser = async (data: RegisterBaseInput) => {
  const { password, ...rest } = data;
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      ...rest,
      passwordHash: hashedPassword,
    },
  });
};
