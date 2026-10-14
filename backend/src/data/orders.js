export let orders = [];

export const ORDER_STATUSES = ['Order Received','Preparing', 'Out for Delivery','Delivered'];
let nextId = 1;

export function addOrder(order) {
  const newOrder = { ...order, id: nextId++, createdAt: new Date().toISOString() };
  orders.push(newOrder);
  return newOrder;
}

export function deleteOrder(id){
  const orderIndex = orders.findIndex(order => order.id === id)
  if(orderIndex === -1) return undefined;
  return orders.splice(orderIndex, 1)[0]
}