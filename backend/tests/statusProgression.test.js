import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  orders,
  addOrder,
  getNextStatus,
  startStatusProgression,
  stopStatusProgression
} from '../src/data/orders.js';

describe('getNextStatus', () => {
  it('advances through the status list in order', () => {
    expect(getNextStatus('Order Received')).toBe('Preparing');
    expect(getNextStatus('Preparing')).toBe('Out for Delivery');
    expect(getNextStatus('Out for Delivery')).toBe('Delivered');
  });

  it('returns null at the end of the flow or for unknown statuses', () => {
    expect(getNextStatus('Delivered')).toBeNull();
    expect(getNextStatus('Nonsense')).toBeNull();
  });
});

describe('startStatusProgression', () => {
  afterEach(() => {
    stopStatusProgression();
    vi.useRealTimers();
  });

  it('advances all active orders over time', () => {
    vi.useFakeTimers();
    orders.length = 0;
    const order = addOrder({ items: [], delivery: {}, status: 'Order Received' });

    startStatusProgression(1000);
    vi.advanceTimersByTime(1000);
    expect(order.status).toBe('Preparing');

    vi.advanceTimersByTime(1000);
    expect(order.status).toBe('Out for Delivery');
  });
});
