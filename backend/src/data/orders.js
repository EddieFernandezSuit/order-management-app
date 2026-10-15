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

export function getNextStatus(status) {
  const index = ORDER_STATUSES.indexOf(status);
  if (index === -1 || index === ORDER_STATUSES.length - 1) return null;
  return ORDER_STATUSES[index + 1];
}

const TRANSITION_MS = Number(process.env.STATUS_TRANSITION_MS) || 5000;
let statusTimer = null;

export function startStatusProgression(transitionMs = TRANSITION_MS) {
  if (statusTimer) return statusTimer;
  statusTimer = setInterval(() => {
    for (const order of orders) {
      const next = getNextStatus(order.status);
      if (next) order.status = next;
    }
  }, transitionMs);
  if (typeof statusTimer.unref === 'function') statusTimer.unref();
  return statusTimer;
}

export function stopStatusProgression() {
  if (statusTimer) {
    clearInterval(statusTimer);
    statusTimer = null;
  }
}
