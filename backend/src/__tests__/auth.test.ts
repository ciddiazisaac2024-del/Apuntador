import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('POST /api/auth/login', () => {
  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'fake', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
