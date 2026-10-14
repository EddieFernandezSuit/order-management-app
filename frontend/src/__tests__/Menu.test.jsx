import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Menu from '../pages/Menu'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

vi.mock('axios')

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('Menu page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders menu items from API', async () => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, name: 'Margherita Pizza', price: 12.99, description: 'Classic' }]
    })

    renderWithRouter(<Menu />)
    
    await waitFor(() => {
      expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
      expect(screen.getByText('12.99')).toBeInTheDocument();
      expect(screen.getByText('Classic')).toBeInTheDocument();
    })
  })
})
