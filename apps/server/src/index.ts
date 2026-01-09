import { User } from '@aura/types';

const testUser: User = {
  id: 'test-123',
  email: 'test@aura.id',
  createdAt: new Date(),
};

console.log('✅ Type-sharing is working! User email:', testUser.email);