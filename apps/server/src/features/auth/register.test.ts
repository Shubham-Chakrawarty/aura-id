import { prisma } from '@/lib/prisma.js';
import { app } from '@/server.js';
import { resetDb } from '@/tests/helpers/reset-db.js';
import request from 'supertest';

const createRegisterData = (overrides = {}) => ({
  email: `test-${Date.now()}@example.com`,
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
});

describe('Register Module Integration Tests', () => {
  beforeEach(async () => await resetDb());

  describe('POST /api/auth/register', () => {
    it('should successfully register a user and persist data securely', async () => {
      const payload = createRegisterData();

      const response = await request(app)
        .post('/api/auth/register')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: { email: payload.email },
        meta: { timestamp: expect.any(String) },
      });

      // Verification: Check DB directly (Triple A Pattern: Arrange, Act, Assert)
      const dbUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser?.passwordHash).not.toBe(payload.password); // Verify hashing
    });

    // This runs the same logic for multiple cases but reports them as separate tests
    describe('Validation Errors', () => {
      it.each([
        { scenario: 'invalid email', data: { email: 'wrong-format' } },
        { scenario: 'weak password', data: { password: '123' } },
        { scenario: 'missing firstName', data: { firstName: '' } },
      ])('should return 400 for $scenario', async ({ data }) => {
        const payload = createRegisterData(data);
        const response = await request(app)
          .post('/api/auth/register')
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });

    it('should return 409 conflict for duplicate emails', async () => {
      const payload = createRegisterData({ email: 'duplicate@test.com' });

      // First registration
      await request(app).post('/api/auth/register').send(payload);

      // Second registration (Conflict)
      const response = await request(app)
        .post('/api/auth/register')
        .send(payload);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });
});
