import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import Cart from '../pages/Cart'
import { CartProvider } from '../context/CartProvider'

const STORAGE_KEY = 'order-management-cart'

function seed(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }))
}

function renderCart() {
  return render(
    <CartProvider>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </CartProvider>
  )
}

describe('Cart', () => {
  beforeEach(() => localStorage.clear())

  it('shows an empty message and a menu link when empty', () => {
    renderCart()
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to menu/i })).toHaveAttribute('href', '/')
  })

  it('renders items and the total', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 2 }])
    renderCart()
    expect(await screen.findByText('Pizza')).toBeInTheDocument()
    expect(screen.getByTestId('qty-1')).toHaveTextContent('2')
    expect(screen.getByText(/total:/i)).toHaveTextContent('$25.98')
  })

  it('increases and decreases quantity', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 2 }])
    renderCart()
    await screen.findByText('Pizza')
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /increase quantity of pizza/i }))
    expect(screen.getByTestId('qty-1')).toHaveTextContent('3')

    await user.click(screen.getByRole('button', { name: /decrease quantity of pizza/i }))
    expect(screen.getByTestId('qty-1')).toHaveTextContent('2')
  })

  it('removes the item when decreasing from 1', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 1 }])
    renderCart()
    await screen.findByText('Pizza')
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /decrease quantity of pizza/i }))
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
  })

  it('removes an item with the remove button', async () => {
    seed([
      { id: 1, name: 'Pizza', price: 12.99, qty: 1 },
      { id: 2, name: 'Burger', price: 9.49, qty: 1 }
    ])
    renderCart()
    await screen.findByText('Pizza')
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /remove pizza/i }))
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
    expect(screen.getByText('Burger')).toBeInTheDocument()
  })

  it('links to checkout', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 1 }])
    renderCart()
    await screen.findByText('Pizza')
    expect(screen.getByRole('link', { name: /proceed to checkout/i })).toHaveAttribute('href', '/checkout')
  })
})
