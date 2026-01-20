import { app } from '@/server.js';
import { resetDb } from '@/tests/helpers/reset-db.js';
import { prisma } from '@aura/database';
import request from 'supertest';

const createRegisterData = (overrides = {}) => ({
  email: `test-${Date.now()}@example.com`,
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
  clientId: 'nexus-web',
  metadata: { theme: 'dark' },
  ...overrides,
});

describe('Register Module Integration Tests', () => {
  beforeEach(async () => await resetDb());

  describe('POST /api/v1/auth/register', () => {
    it('should successfully register a user and scope metadata to clientId', async () => {
      const payload = createRegisterData();

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(payload);

      expect(response.status).toBe(201);

      // Asserting response structure (SafeUser)
      expect(response.body.data).toMatchObject({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        id: expect.any(String),
        avatarUrl: expect.any(String),
        isEmailVerified: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        appSettings: payload.metadata,
      });

      // Verification: Check DB for multi-tenant structure
      const dbUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      expect(dbUser).not.toBeNull();
      // Ensure metadata is nested: { "nexus-web": { "theme": "dark" } }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata = dbUser?.metadata as any;
      expect(metadata[payload.clientId]).toEqual(payload.metadata);

      // Security check: Never store plain text passwords
      expect(dbUser?.passwordHash).not.toBe(payload.password);
    });

    describe('Validation Errors', () => {
      it.each([
        { scenario: 'invalid email', data: { email: 'wrong-format' } },
        { scenario: 'weak password', data: { password: '123' } },
        { scenario: 'missing clientId', data: { clientId: '' } },
      ])('should return 400 for $scenario', async ({ data }) => {
        // We omit the required field or provide bad data
        const payload = { ...createRegisterData(), ...data };
        if (data.clientId === '')
          delete (payload as unknown as Record<string, unknown>).clientId;

        const response = await request(app)
          .post('/api/v1/auth/register')
          .send(payload);

        expect(response.status).toBe(400);
      });
    });

    it('should correctly handle registration without optional metadata', async () => {
      const { metadata: _metadata, ...payload } = createRegisterData();

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(payload);

      expect(response.status).toBe(201);

      const dbUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((dbUser?.metadata as any)[payload.clientId]).toEqual({});
    });

    it('should return 409 conflict for duplicate emails', async () => {
      const payload = createRegisterData({ email: 'duplicate@test.com' });

      // First registration
      await request(app).post('/api/v1/auth/register').send(payload);

      // Second registration (Conflict)
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(payload);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });
});
