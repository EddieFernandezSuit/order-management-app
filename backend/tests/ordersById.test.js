import request from 'supertest'
import app from '../src/app.js'
import {describe, it, expect, beforeEach } from 'vitest';
import {orders} from '../src/data/orders.js';

describe('GET /api/orders/:id', ()=>{
    beforeEach(()=>{
        orders.length = 0; //clear in memory store between tests
    })

    it('returns 404 if order does not exist', async () =>{
        const res = await request(app).get('/api/orders/999');
        expect(res.status).toBe(404)
    })

    it('returns the order with its current status when found', async() => {
        const created = await request(app)
            .post('/api/orders')
            .send({
                items:[{menuItemId: 1, qty:1}],
                delivery:{
                    name:'Jane',
                    address: '456 Oak St',
                    phone:'9876543210'
                }
            })
        const orderId = created.body.id
        const res = await request(app).get(`/api/orders/${orderId}`)
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(orderId);
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('Order Received');
        expect(res.body).toHaveProperty('delivery');
    });
});

