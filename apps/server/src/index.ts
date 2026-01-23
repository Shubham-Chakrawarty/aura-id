import { disconnectDB, prisma } from '@aura/database';
import { Server } from 'http';
import { env } from './config/env.config.js';
import { app } from './server.js';

let server: Server;

async function handleExit(signal: string, code: number = 0) {
  console.log(`\n${signal} received. Cleaning up...`);

  if (server) {
    server.close();
  }

  await disconnectDB();
  console.log('🛑 Connections closed. Goodbye!');
  process.exit(code);
}

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    server = app.listen(env.PORT, () => {
      console.log(`🚀 Auth service: http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error);
    await handleExit('CRASH', 1);
  }
}

// Global listeners for clean exit
process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));

bootstrap();
