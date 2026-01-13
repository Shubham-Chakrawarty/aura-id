import { env } from '@/config/env.config.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import pg from 'pg';
import { PrismaClient } from '../generated/prisma/client.js';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use the 'pg' Pool for better connection management
const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
