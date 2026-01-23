import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';

export function createPrismaClient(dbUrl: string, isDev: boolean) {
  const pool = new pg.Pool({ connectionString: dbUrl });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });

  return {
    prisma: client,
    close: async () => {
      await client.$disconnect();
      await pool.end();
    },
  };
}
