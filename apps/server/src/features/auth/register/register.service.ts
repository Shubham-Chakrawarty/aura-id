import { findUserByEmail } from '@/features/user/user.service.js';
import { hashPassword } from '@/lib/password.js';
import { AppError } from '@/utils/app-error.js';
import { prisma } from '@aura/database';
import { RegisterRequest } from '@aura/shared/auth';

export const registerUser = async (data: RegisterRequest) => {
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

export const createUnverifiedUser = async (data: RegisterRequest) => {
  const {
    password,
    email,
    firstName,
    lastName,
    clientId,
    metadata,
    avatarUrl,
  } = data;
  const hashedPassword = await hashPassword(password);

  // Nest the metadata under the clientId key to prevent overwriting
  const userMetadata = clientId ? { [clientId]: metadata || {} } : {};

  return await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      passwordHash: hashedPassword,
      metadata: userMetadata,
      avatarUrl: avatarUrl || null,
    },
  });
};
