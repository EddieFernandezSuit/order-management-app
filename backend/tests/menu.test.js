import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect } from 'vitest';

describe('GET /api/menu', () => {
  it('returns an array of menu items with the correct shape', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('price');
    }
  });
});
