import request from 'supertest';
import app from '../src/app.js';
import { describe, it, expect, beforeEach } from 'vitest';
import { orders } from '../src/data/orders.js';


describe('GET /api/orders/',()=>{

    beforeEach(()=>{
        orders.length = 0;
    })

    it('returns an empty array when there are no orders',async ()=>{
        const res = await request(app).get('/api/orders');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toHaveLength(0);
    });

    it('returns all created orders', async()=>{
        await request(app).post('/api/orders').send({
            items:[{menuItemId:1, qty:1}],
            delivery: {name: 'A', address:'x', phone:'1234567890'}
        });
        await request(app).post('/api/orders').send({
            items:[{menuItemId:2, qty: 2}],
            delivery: {name:'B', address:'y',phone:'0987654321'}
        });

        const res = await request(app).get('/api/orders');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        // expect(res.body[0]) = 
    })
})