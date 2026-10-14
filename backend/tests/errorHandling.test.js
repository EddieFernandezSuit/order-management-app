import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect } from 'vitest';

describe('error handling', () => {
  it('returns JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.type).toBe('application/json');
    expect(res.body).toHaveProperty('error');
  });

  it('returns JSON 400 for malformed JSON bodies', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Content-Type', 'application/json')
      .send('{ invalid json ');

    expect(res.status).toBe(400);
    expect(res.type).toBe('application/json');
    expect(res.body).toHaveProperty('error');
  });
});
