import { prisma } from '@aura/database';
import { env } from './config/env.config.js';
import { app } from './server.js';

async function bootstrap() {
  try {
    // 1. Initialize Prisma Connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // 2. Start the Express Server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Auth service running on: http://localhost:${env.PORT}`);
    });

    // 3. Graceful Shutdown Logic
    const shutdown = async (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        // Close Prisma connection
        await prisma.$disconnect();
        console.log('🛑 Database disconnected');
        process.exit(0);
      });
    };

    // Listen for termination signals (Docker/Node stop)
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start the service:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
