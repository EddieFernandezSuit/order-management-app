import request from 'supertest';
import app from '../src/app.js';
import {describe, it, expect, beforeEach} from 'vitest';
import {orders} from '../src/data/orders.js';

describe('PATCH /api/orders/:id/status', () => {
    beforeEach(() => {
        orders.length = 0;
    })

    const validOrder = {
        items:[{menuItemId:1, qty:1}],
        delivery:{
            name:'Alex',
            address:'123 Main St',
            phone: '5555555555'
    }}

    it('returns 404 if order not exist', async () => {
        const res = await request(app).patch('/api/orders/999/status')
            .send({status: 'Preparing'});
        expect(res.status).toBe(404);
    })

    it('updates the order status when valid', async () => {
        const created = await request(app)
            .post('/api/orders')
            .send({
                items:[{menuItemId:1, qty: 1}],
                delivery: {
                    name: 'Alex',
                    address: '123 Main St',
                    phone: '5555555555'
                }
            })
        
        const id = created.body.id;
        const res = await request(app).patch(`/api/orders/${id}/status`).send({status: 'Preparing'});
        
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(id)
        expect(res.body.status).toBe('Preparing');
    })

    it('updates only the targeted order when multiple exist', async () => {
        let order1 = await request(app)
            .post('/api/orders')
            .send(validOrder);
        
        const order2 = await request(app)
            .post('/api/orders')
            .send({
                items:[{menuItemId:2,qty:2}],
                delivery:{
                    name:'Mark',
                    address:'22 baker st',
                    phone:'1111111111',
                }
            });

        const id1 = order1.body.id;
        const id2 = order2.body.id;
        const res = await request(app).patch(`/api/orders/${id2}/status`).send({status:'Preparing'});
        order1 = await request(app).get(`/api/orders/${id1}`);
        
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(id2)
        expect(res.body.status).toBe('Preparing');
        expect(order1.body.status).toBe('Order Received')
    })

    it('rejects a status outside the allow-list', async () => {
    const created = await request(app).post('/api/orders').send(validOrder);
    const res = await request(app).patch(`/api/orders/${created.body.id}/status`)
        .send({ status: 'Teleported' });
    expect(res.status).toBe(400);
    });
})