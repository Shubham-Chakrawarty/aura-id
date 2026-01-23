import { hashString } from '@aura/shared';
import { env } from '../src/config/env.config.js';
import { ApplicationCreateInput } from '../src/generated/prisma/models.js';
import { createPrismaClient } from '../src/lib/factory.js';

const { prisma, close } = createPrismaClient(env.DATABASE_URL, true);

async function main() {
  console.log('🌱 Seeding Professional AuraID Infrastructure...');
  const hashedAdminSecret = await hashString(env.ADMIN_PORTAL_SECRET);
  const systemApps: ApplicationCreateInput[] = [
    {
      id: 'app_sys_auth_001',
      clientId: env.AUTH_PORTAL_CLIENT_ID,
      name: 'Aura Identity Portal',
      appType: 'SPA',
      redirectUris: [env.AUTH_PORTAL_REDIRECT_URI],
    },
    {
      id: 'app_sys_admin_002',
      clientId: env.ADMIN_PORTAL_CLIENT_ID,
      name: 'Aura Management Console',
      appType: 'WEB',
      redirectUris: [env.ADMIN_PORTAL_REDIRECT_URI],
      clientSecret: hashedAdminSecret, // Admin needs a secret because it is a "WEB" appType
    },
  ];

  for (const app of systemApps) {
    await prisma.application.upsert({
      where: { clientId: app.clientId },
      update: {
        name: app.name,
      },
      create: app,
    });
  }
}
main()
  .then(async () => {
    console.log('✅ Infrastructure Seeded Successfully.');
    await close();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await close();
    process.exit(1);
  });
