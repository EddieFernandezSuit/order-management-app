import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect } from 'vitest';

describe('POST /api/orders', () => {
  it('returns 400 if delivery details are missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [{ menuItemId: 1, qty: 2 }]
      });

    expect(res.status).toBe(400);
  });

  it('creates an order with status "Order Received" when valid', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        items: [{ menuItemId: 1, qty: 2 }],
        delivery: {
          name: 'John',
          address: '123 Main St',
          phone: '1234567890'
        }
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('Order Received');
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
