import request from 'supertest';
import app from '../../../app';
import { prisma } from '../../../config/db';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '../../../generated/prisma/client';
import { hashPassword, generateRefreshToken } from '../../../utils/authUtils';

jest.mock('../../../config/db', () => ({
  __esModule: true,
  prisma: require('jest-mock-extended').mockDeep(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Routing Pipelines - Complete Integration Tests', () => {
  const password = 'ValidPassword123!';

  const dummyUser = (customHash = 'hashed_password') => ({
    id: 'user-id-abc',
    username: 'testrunner',
    email: 'runner@example.com',
    password: customHash,
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  describe('POST /api/auth/register', () => {
    it('should complete registration and hide the password property', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(dummyUser());

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testrunner', email: 'runner@example.com', password });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject requests that fail Zod v4 validation rules with 400', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'x', email: 'not-an-email', password: '1' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation Failed');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authorize a user with correct credentials and issue cookies', async () => {
      const cryptedHash = await hashPassword(password);
      prismaMock.user.findFirst.mockResolvedValue(dummyUser(cryptedHash));
      prismaMock.user.update.mockResolvedValue(dummyUser(cryptedHash));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'runner@example.com', password });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return a 401 Unauthorized if the credentials do not match', async () => {
      const cryptedHash = await hashPassword(password);
      prismaMock.user.findUnique.mockResolvedValue(dummyUser(cryptedHash));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ identifier: 'runner@example.com', password: 'WrongPasswordInput' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid username or email or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should revoke active refresh sessions and issue empty cookies', async () => {
      const activeToken = generateRefreshToken('user-id-abc');
      prismaMock.user.update.mockResolvedValue(dummyUser());

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', [`refreshToken=${activeToken}`]);

      expect(res.status).toBe(200);
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id-abc' },
        data: { refreshToken: null },
      });
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should rotate access tokens when a valid active session cookie is supplied', async () => {
      const activeToken = generateRefreshToken('user-id-abc');
      const userRecord = { ...dummyUser(), refreshToken: activeToken };
      prismaMock.user.findUnique.mockResolvedValue(userRecord);

      const res = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refreshToken=${activeToken}`]);

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });
  });
});