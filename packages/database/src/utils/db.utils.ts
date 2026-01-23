import { prisma } from '../lib/prisma.js';

export const resetDb = async () => {
  // Guard against running in production environment
  if (process.env.NODE_ENV === 'production') {
    throw new Error('resetDb cannot be run in production environment.');
  }

  const tablenames = await prisma.$queryRawUnsafe<Array<{ tablename: string }>>(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
  );

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  if (!tables) return; // Nothing to truncate

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};
