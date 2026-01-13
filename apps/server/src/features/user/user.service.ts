import { prisma } from '@/lib/prisma.js';

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserForApp = async (email: string, clientId: string) => {
  const user = await findUserByEmail(email);

  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metadata = user.metadata as Record<string, any>;
  const isRegisteredForApp = !!metadata[clientId];

  return {
    user,
    isRegisteredForApp,
  };
};
