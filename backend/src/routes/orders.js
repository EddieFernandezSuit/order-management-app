import express from 'express';
import { addOrder, deleteOrder, ORDER_STATUSES } from '../data/orders.js';
import { orders } from '../data/orders.js';
import { findMenuItem } from '../data/menu.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { items, delivery } = req.body;

  // Basic validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items are required' });
  }

  if (items.some(item=>!Number.isInteger(item.qty) || item.qty < 1 || !findMenuItem(item.menuItemId))){
    return res.status(400).json({error: 'invalid qty or invalid menu item id'})
  };

  if (!delivery || !delivery.name || !delivery.address || !delivery.phone) {
    return res.status(400).json({ error: 'Delivery details are required' });
  }
  
  if (!/^\d{7,15}$/.test(delivery.phone)){
    return res.status(400).json({error: 'invalid phone number'});
  };


  const orderItems = items.map(({ menuItemId, qty }) => {
    const menuItem = findMenuItem(menuItemId);
    return {
      menuItemId,
      name: menuItem.name,
      price: menuItem.price,
      qty,
      lineTotal: Number((menuItem.price * qty).toFixed(2))
    };
  });

  const total = Number(orderItems.reduce((sum, i) => sum + i.lineTotal, 0).toFixed(2));

  const order = addOrder({
    items: orderItems,
    total,
    delivery,
    status: 'Order Received'
  });

  res.status(201).json(order);
});

router.delete('/:id', (req, res)=>{
  const id = parseInt(req.params.id);
  
  const deleted = deleteOrder(id);
  if(!deleted){
    return res.status(404).json({error: 'Order not found'});
  }
  res.status(204).end();
})

router.get('/:id', (req,res)=>{
    const id = parseInt(req.params.id);
    const order = orders.find((o)=>o.id === id);

    if(!order){
        return res.status(404).json({error:'Order not found'});
    }

    res.json(order);
})

router.get('/',(req,res)=>{
  res.json(orders);
});

router.patch('/:id/status', (req,res)=>{
    const id = parseInt(req.params.id);
    const order = orders.find((o) => o.id === id);

    if(!order){
        return res.status(404).json({error: 'Order not found'});
    }
    const {status} = req.body;

    if(!ORDER_STATUSES.includes(status)) return res.status(400).json({error: 'invalid status'});

    if(!status){
        return res.status(400).json({error: 'Status is required'});
    }    
    order.status = status;
    res.json(order);
})

export default router;