import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';
// 1. Connection Pool setup
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Adapter setup
const adapter = new PrismaPg(pool);

// 3. Singleton logic for Monorepo/Dev environments
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '../generated/prisma/client.js';
