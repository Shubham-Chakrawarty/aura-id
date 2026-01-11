import { prisma } from '@/lib/prisma.js';
import { execSync } from 'child_process';
import { afterAll, beforeAll } from 'vitest';

beforeAll(async () => {
  try {
    // Standard push without the obsolete flag
    execSync('npx prisma db push', { env: process.env });
  } catch (error) {
    console.error('Database sync failed. Ensure your test Docker container is running on port 5435.', error);
    process.exit(1);
  }
});

afterAll(async () => {
  // Gracefully close Prisma connection so Vitest doesn't hang
  await prisma.$disconnect();
});
