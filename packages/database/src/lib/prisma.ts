import { env } from '../config/env.config.js';
import { createPrismaClient } from './factory.js';

// Use globalThis for maximum portability (Next.js, Deno, Cloudflare Workers, etc.)
const globalForPrisma = globalThis as unknown as {
  prismaInstance?: ReturnType<typeof createPrismaClient>;
};

export const { prisma, close } =
  globalForPrisma.prismaInstance ??
  (globalForPrisma.prismaInstance = createPrismaClient(
    env.DATABASE_URL,
    env.NODE_ENV === 'development',
  ));
