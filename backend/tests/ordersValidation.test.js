import request from 'supertest';
import app from '../src/app.js';
import {describe, it, expect, beforeEach} from 'vitest';
import { orders } from '../src/data/orders.js';


describe('POST /api/orders validation', () => {
  beforeEach(() => { orders.length = 0; });

  const validDelivery = { name: 'A', address: '123 Main St', phone: '1234567890' };

  it('rejects an item with an unknown menuItemId', async () => {
    const res = await request(app).post('/api/orders')
      .send({ items: [{ menuItemId: 999, qty: 1 }], delivery: validDelivery });
    expect(res.status).toBe(400);
  });

  it('rejects qty that is not a positive integer', async () => {
    for (const qty of [0, -1, 1.5, '2']) {
      const res = await request(app).post('/api/orders')
        .send({ items: [{ menuItemId: 1, qty }], delivery: validDelivery });
      expect(res.status).toBe(400);
    }
  });

  it('rejects invalid phone', async () => {
    const res = await request(app).post('/api/orders')
      .send({ items: [{ menuItemId: 1, qty: 1 }], delivery: { ...validDelivery, phone: 'abc' } });
    expect(res.status).toBe(400);
  });
});