import { env } from '../src/config/env.config.js';
import { Prisma } from '../src/generated/prisma/client.js';
import { createPrismaClient } from '../src/lib/factory.js';
import { hashString } from '../src/utils/hash.utils.js';

const { prisma, disconnectDB } = createPrismaClient(env.DATABASE_URL, true);

async function main() {
  console.log('🌱 Seeding AuraID Infrastructure...');

  // 1. Prepare Admin Credentials
  const hashedAdminSecret = await hashString(env.ADMIN_PORTAL_SECRET);
  const hashedUserPassword = await hashString(env.ADMIN_PASSWORD);

  // 2. Seed System Applications
  const systemApps: Prisma.ApplicationCreateInput[] = [
    {
      id: 'app_sys_auth_001',
      name: 'Aura Identity Portal',
      appType: 'SPA',
      status: 'ACTIVE',
      clientId: env.AUTH_PORTAL_CLIENT_ID,
      redirectUris: [env.AUTH_PORTAL_REDIRECT_URI],
    },
    {
      id: 'app_sys_admin_002',
      clientId: env.ADMIN_PORTAL_CLIENT_ID,
      name: 'Aura Management Console',
      appType: 'WEB',
      status: 'ACTIVE',
      redirectUris: [env.ADMIN_PORTAL_REDIRECT_URI],
      clientSecret: hashedAdminSecret,
    },
  ];

  for (const app of systemApps) {
    await prisma.application.upsert({
      where: { clientId: app.clientId },
      update: {
        name: app.name,
        redirectUris: app.redirectUris,
        clientSecret: app.clientSecret,
        status: app.status,
      },
      create: app,
    });
  }

  // 3. Seed "God Mode" Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: env.ADMIN_EMAIL },
    update: {}, // No updates to preserve existing admin data
    create: {
      email: env.ADMIN_EMAIL,
      passwordHash: hashedUserPassword,
      firstName: 'Shubham',
      lastName: 'Chakrawarty',
      status: 'ACTIVE',
      isEmailVerified: true,
    },
  });

  // 4. Create the "Visa" (Membership)
  await prisma.applicationMembership.upsert({
    where: {
      userId_applicationId: {
        userId: adminUser.id,
        applicationId: 'app_sys_admin_002',
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      applicationId: 'app_sys_admin_002',
      role: 'SUPER_ADMIN',
      grantedScopes: ['openid', 'profile', 'admin:all'],
    },
  });

  console.log('✅ Infrastructure & Admin Seeded Successfully.');
}

main()
  .then(async () => {
    await disconnectDB();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await disconnectDB();
    process.exit(1);
  });
