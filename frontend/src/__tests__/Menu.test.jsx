import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Menu from '../pages/Menu'
import { CartProvider } from '../context/CartProvider'
import api from '../api/client'

vi.mock('../api/client');

function renderMenu() {
  return render(
    <CartProvider>
      <BrowserRouter>
        <Menu />
      </BrowserRouter>
    </CartProvider>
  );
}

describe('Menu', () => {
  beforeEach(() => localStorage.clear());

  it('renders items and adds to cart', async () => {
    api.get.mockResolvedValueOnce({
      data: [{ id: 1, name: 'Margherita Pizza', price: 12.99, description: 'Classic', image: '/m.jpg' }]
    });
    renderMenu();
    expect(await screen.findByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Margherita Pizza' })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByText(/cart \(1\)/i)).toBeInTheDocument();
  });
});