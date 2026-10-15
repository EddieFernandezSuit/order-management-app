import { render, screen, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import OrderStatus from '../pages/OrderStatus'
import api from '../api/client'

vi.mock('../api/client')

function renderStatus(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/order/${id}`]}>
      <Routes>
        <Route path="/order/:id" element={<OrderStatus />} />
      </Routes>
    </MemoryRouter>
  )
}

async function flush() {
  await act(async () => {
    await Promise.resolve()
  })
}

describe('OrderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches and displays the current status', async () => {
    api.get.mockResolvedValueOnce({ data: { id: 1, status: 'Preparing' } })
    renderStatus()

    expect(await screen.findByText('Status: Preparing')).toBeInTheDocument()
    expect(screen.getByText('Order #1')).toBeInTheDocument()
    expect(api.get).toHaveBeenCalledWith('/api/orders/1')
  })

  it('shows an error when the order is not found', async () => {
    api.get.mockRejectedValueOnce({ response: { status: 404 } })
    renderStatus('999')

    expect(await screen.findByRole('alert')).toHaveTextContent(/order not found/i)
  })

  it('polls and updates the status', async () => {
    vi.useFakeTimers()
    api.get.mockResolvedValueOnce({ data: { id: 1, status: 'Order Received' } })
    renderStatus()
    await flush()
    expect(screen.getByText('Status: Order Received')).toBeInTheDocument()

    api.get.mockResolvedValueOnce({ data: { id: 1, status: 'Preparing' } })
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })
    await flush()
    expect(screen.getByText('Status: Preparing')).toBeInTheDocument()
  })

  it('stops polling after delivery', async () => {
    vi.useFakeTimers()
    api.get.mockResolvedValue({ data: { id: 1, status: 'Delivered' } })
    renderStatus()
    await flush()
    expect(screen.getByText('Status: Delivered')).toBeInTheDocument()

    const calls = api.get.mock.calls.length
    await act(async () => {
      vi.advanceTimersByTime(9000)
    })
    await flush()
    expect(api.get).toHaveBeenCalledTimes(calls)
  })
})
