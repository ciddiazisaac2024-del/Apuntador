import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';

// Mock DB
vi.mock('../config/db', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn().mockImplementation((plain, hash) => plain === 'correctpassword' && hash === 'hashed_password'),
  }
}));

process.env.JWT_SECRET = 'test_secret_key';

describe('Auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const agent = request(app);

  describe('POST /api/auth/login', () => {
    it('should return 401 for invalid credentials (user not found)', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const res = await agent
        .post('/api/auth/login')
        .send({ username: 'fake', password: 'wrong' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        role: 'supervisor',
        passwordHash: 'hashed_password', // Mocked hash
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);

      const res = await agent
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'correctpassword' });

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('testuser');
      
      // Ensure the HttpOnly cookie is set
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/token=.*HttpOnly/);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear the cookie on logout', async () => {
      const res = await agent.post('/api/auth/logout');
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out');
      const cookies = res.headers['set-cookie'];
      expect(cookies[0]).toMatch(/token=;/); // empty token
    });
  });
});
