import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import jwt from 'jsonwebtoken';

// Mock dependencies
vi.mock('../config/db', () => ({
  default: {
    case: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

process.env.JWT_SECRET = 'test_secret_key';

describe('Cases CRUD API', () => {
  let testToken: string;

  beforeAll(() => {
    // Simulate a valid token for a supervisor
    testToken = jwt.sign({ id: '1', username: 'admin', role: 'supervisor' }, process.env.JWT_SECRET!);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const agent = request(app);

  it('GET /api/cases - should return list of cases', async () => {
    const mockCases = [{ id: '1', name: 'Test Case', type: 'Type A' }];
    vi.mocked(prisma.case.findMany).mockResolvedValue(mockCases as any);

    const res = await agent
      .get('/api/cases')
      .set('Cookie', [`token=${testToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockCases);
    expect(prisma.case.findMany).toHaveBeenCalledTimes(1);
  });

  it('POST /api/cases - should create a new case', async () => {
    const newCase = { id: '2', name: 'New Case', type: 'Type B', content: 'content' };
    vi.mocked(prisma.case.create).mockResolvedValue(newCase as any);

    const res = await agent
      .post('/api/cases')
      .set('Cookie', [`token=${testToken}`])
      .send({ name: 'New Case', type: 'Type B', content: 'content' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(newCase);
    expect(prisma.case.create).toHaveBeenCalledWith({
      data: { name: 'New Case', type: 'Type B', content: 'content', createdById: '1' }
    });
  });

  it('POST /api/cases - should validate required fields', async () => {
    const res = await agent
      .post('/api/cases')
      .set('Cookie', [`token=${testToken}`])
      .send({ name: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Name, type, and content are required');
  });

  it('PUT /api/cases/:id - should update a case', async () => {
    const updatedCase = { id: '1', name: 'Updated', type: 'Type C', content: 'Updated content' };
    vi.mocked(prisma.case.update).mockResolvedValue(updatedCase as any);

    const res = await agent
      .put('/api/cases/1')
      .set('Cookie', [`token=${testToken}`])
      .send({ name: 'Updated', type: 'Type C', content: 'Updated content' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedCase);
  });

  it('DELETE /api/cases/:id - should delete a case', async () => {
    vi.mocked(prisma.case.delete).mockResolvedValue({} as any);

    const res = await agent
      .delete('/api/cases/1')
      .set('Cookie', [`token=${testToken}`]);

    expect(res.status).toBe(204);
    expect(prisma.case.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
