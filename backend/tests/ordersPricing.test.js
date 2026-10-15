import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { orders } from '../src/data/orders.js';

describe('POST /api/orders pricing', () => {
  beforeEach(() => {
    orders.length = 0;
  });

  const delivery = { name: 'A', address: '123 Main St', phone: '1234567890' };

  it('computes line totals and order total from the menu', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [
        { menuItemId: 1, qty: 2, price: 0.01 },
        { menuItemId: 3, qty: 1 }
      ],
      delivery
    });

    expect(res.status).toBe(201);
    expect(res.body.items[0].price).toBe(12.99);
    expect(res.body.items[0].name).toBe('Cheese Pizza');
    expect(res.body.items[0].lineTotal).toBe(25.98);
    expect(res.body.total).toBe(33.97);
  });

  it('ignores a client-provided total', async () => {
    const res = await request(app).post('/api/orders').send({
      items: [{ menuItemId: 2, qty: 1 }],
      delivery,
      total: 0
    });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(9.49);
  });
});
