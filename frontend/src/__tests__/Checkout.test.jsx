import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useParams } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Checkout from '../pages/Checkout'
import { CartProvider } from '../context/CartProvider'
import api from '../api/client'

vi.mock('../api/client')

const STORAGE_KEY = 'order-management-cart'

function seed(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }))
}

function OrderStub() {
  const { id } = useParams()
  return <div>Order confirmation {id}</div>
}

function renderCheckout() {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderStub />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  )
}

async function fillForm(user) {
  await user.type(screen.getByLabelText(/name/i), 'Jane')
  await user.type(screen.getByLabelText(/address/i), '123 Main St')
  await user.type(screen.getByLabelText(/phone/i), '1234567890')
}

describe('Checkout', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('shows an empty message when the cart is empty', () => {
    renderCheckout()
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument()
  })

  it('validates required fields before submitting', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 1 }])
    renderCheckout()
    await screen.findByText(/total:/i)

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(await screen.findAllByRole('alert')).toHaveLength(3)
    expect(api.post).not.toHaveBeenCalled()
  })

  it('places the order and navigates to the status page', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 2 }])
    api.post.mockResolvedValueOnce({ data: { id: 42 } })
    renderCheckout()
    await screen.findByText(/total:/i)

    const user = userEvent.setup()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1))
    expect(api.post).toHaveBeenCalledWith('/api/orders', {
      items: [{ menuItemId: 1, qty: 2 }],
      delivery: { name: 'Jane', address: '123 Main St', phone: '1234567890' }
    })
    expect(await screen.findByText(/order confirmation 42/i)).toBeInTheDocument()
  })

  it('shows an error message when the request fails', async () => {
    seed([{ id: 1, name: 'Pizza', price: 12.99, qty: 1 }])
    api.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid phone number' } } })
    renderCheckout()
    await screen.findByText(/total:/i)

    const user = userEvent.setup()
    await fillForm(user)
    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(await screen.findByText(/invalid phone number/i)).toBeInTheDocument()
  })
})
