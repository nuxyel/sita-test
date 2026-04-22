import request from 'supertest';

import { app } from '../src/index';
import { authenticateUser, registerUser } from '../src/services/authService';
import { createProduct } from '../src/services/productService';
import { resetTestDatabase, setupTestDatabase, teardownTestDatabase } from './testUtils';

describe('products routes', () => {
  let token = '';

  const authorize = (req: request.Test): request.Test =>
    req.set('Authorization', `Bearer ${token}`);

  beforeAll(() => {
    setupTestDatabase('products-routes');
  });

  beforeEach(async () => {
    resetTestDatabase();

    await registerUser({
      email: 'tester@example.com',
      password: 'password123'
    });

    const authResponse = await authenticateUser({
      email: 'tester@example.com',
      password: 'password123'
    });

    token = authResponse?.token ?? '';
  });

  afterAll(() => {
    teardownTestDatabase();
  });

  it('GET /api/products returns an empty array', async () => {
    const response = await authorize(request(app).get('/api/products')).expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.message).toBe('Products retrieved successfully');
  });

  it('POST /api/products creates a product and returns 201', async () => {
    const response = await authorize(
      request(app).post('/api/products').send({
        name: 'Shelf Sensor',
        description: 'Sensor used for automated inventory shelf monitoring.',
        price: 120.5,
        stockQuantity: 10
      })
    ).expect(201);

    expect(response.body.data).toMatchObject({
      name: 'Shelf Sensor',
      stockQuantity: 10
    });
  });

  it('POST /api/products returns 400 with empty name', async () => {
    const response = await authorize(
      request(app).post('/api/products').send({
        name: '',
        description: 'Sensor used for automated inventory shelf monitoring.',
        price: 120.5,
        stockQuantity: 10
      })
    ).expect(400);

    expect(response.body).toMatchObject({
      error: 'Validation failed'
    });
  });

  it('GET /api/products/:id returns the correct product', async () => {
    const product = createProduct({
      name: 'Stock Beacon',
      description: 'Beacon for location-aware stock tracking.',
      price: 88.0,
      stockQuantity: 15
    });

    const response = await authorize(request(app).get(`/api/products/${product.id}`)).expect(200);

    expect(response.body.data).toMatchObject({
      id: product.id,
      name: 'Stock Beacon'
    });
  });

  it('GET /api/products/:id returns 404 if not found', async () => {
    const response = await authorize(request(app).get('/api/products/999')).expect(404);

    expect(response.body).toEqual({ error: 'Product not found' });
  });

  it('PUT /api/products/:id updates and returns the product', async () => {
    const product = createProduct({
      name: 'Intake Kiosk',
      description: 'Kiosk for inbound product registration.',
      price: 950.0,
      stockQuantity: 2
    });

    const response = await authorize(
      request(app).put(`/api/products/${product.id}`).send({
        name: 'Intake Kiosk v2',
        description: 'Updated kiosk for inbound product registration.',
        price: 980.0,
        stockQuantity: 4
      })
    ).expect(200);

    expect(response.body.data).toMatchObject({
      id: product.id,
      name: 'Intake Kiosk v2',
      stockQuantity: 4
    });
  });

  it('DELETE /api/products/:id returns 204', async () => {
    const product = createProduct({
      name: 'Asset Dock',
      description: 'Docking station for inspection and cataloguing.',
      price: 640.0,
      stockQuantity: 8
    });

    await authorize(request(app).delete(`/api/products/${product.id}`)).expect(204);

    await authorize(request(app).get(`/api/products/${product.id}`)).expect(404);
  });

  it('GET /api/products returns 401 without token', async () => {
    const response = await request(app).get('/api/products').expect(401);

    expect(response.body).toEqual({ error: 'Missing or invalid token' });
  });
});
