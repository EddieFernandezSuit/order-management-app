import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, useCart } from '../context/CartContext';

describe('CartContext', () => {
  it('adds an item and accumulates quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem({ id: 1, name: 'Pizza', price: 12.99 }));
    act(() => result.current.addItem({ id: 1, name: 'Pizza', price: 12.99 }));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(2);
    expect(result.current.total).toBeCloseTo(25.98);
  });

  it('sets quantity and removes when qty <= 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem({ id: 1, name: 'Pizza', price: 12.99 }));
    act(() => result.current.setQty(1, 3));
    expect(result.current.items[0].qty).toBe(3);
    expect(result.current.total).toBeCloseTo(38.97);
    act(() => result.current.setQty(1, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it('removes an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem({ id: 1, name: 'Pizza', price: 12.99 }));
    act(() => result.current.addItem({ id: 2, name: 'Burger', price: 9.49 }));
    act(() => result.current.removeItem(1));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(2);
  });

  it('clears the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    act(() => result.current.addItem({ id: 1, name: 'Pizza', price: 12.99 }));
    act(() => result.current.clear());
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });
});
