import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { orders } from '../src/data/orders.js';

describe('DELETE /api/orders/:id',()=>{
    beforeEach(()=>{orders.length =0;});

    it('returns 404 for a missing order', async ()=>{
        const res = await request(app).delete('/api/orders/999');
        expect(res.status).toBe(404);
    });

    it('deletes and existing order', async ()=>{
        const created = await request(app).post('/api/orders/').send({
            items:[{menuItemId:1,qty:1}],
            delivery: {name: 'A', address:'x', phone:'123467890'},
        })

        const id = created.body.id;
        const deleted = await request(app).delete(`/api/orders/${created.body.id}`);
        expect(deleted.status).toBe(204);

        const after = await request(app).get(`/api/orders/${id}`)
        expect(after.status).toBe(404);
    })
});