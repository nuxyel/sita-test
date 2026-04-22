import request from 'supertest';

import { app } from '../src/index';
import { registerUser } from '../src/services/authService';
import { resetTestDatabase, setupTestDatabase, teardownTestDatabase } from './testUtils';

describe('auth routes', () => {
  beforeAll(() => {
    setupTestDatabase('auth-routes');
  });

  beforeEach(() => {
    resetTestDatabase();
  });

  afterAll(() => {
    teardownTestDatabase();
  });

  it('POST /api/auth/login returns a token for valid credentials', async () => {
    await registerUser({
      email: 'tester@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'tester@example.com',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      user: {
        email: 'tester@example.com'
      }
    });
    expect(response.body.message).toBe('Login successful');
    expect(typeof response.body.data.token).toBe('string');
    expect(response.body.data.token.length).toBeGreaterThan(0);
  });

  it('POST /api/auth/login returns 401 for invalid credentials', async () => {
    await registerUser({
      email: 'tester@example.com',
      password: 'password123'
    });

    const response = await request(app).post('/api/auth/login').send({
      email: 'tester@example.com',
      password: 'wrong-password'
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Invalid credentials'
    });
  });
});
