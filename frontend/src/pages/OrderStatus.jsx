import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api/client'

const STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered']
const POLL_MS = 3000

export default function OrderStatus() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let timer

    async function load() {
      try {
        const res = await api.get(`/api/orders/${id}`)
        if (cancelled) return
        setOrder(res.data)
        if (res.data.status !== 'Delivered') {
          timer = setTimeout(load, POLL_MS)
        }
      } catch (err) {
        if (cancelled) return
        setError(err.response?.status === 404 ? 'Order not found' : 'Failed to load order')
      }
    }

    load()

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [id])

  if (error) {
    return (
      <div>
        <h1>Order Status</h1>
        <p role="alert">{error}</p>
        <Link to="/">Back to menu</Link>
      </div>
    )
  }

  if (!order) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Order Status</h1>
      <p>Order #{order.id}</p>
      <ol>
        {STATUSES.map((status) => (
          <li key={status} aria-current={status === order.status ? 'step' : undefined}>
            {status}
          </li>
        ))}
      </ol>
      <p>Status: {order.status}</p>
      <Link to="/">Back to menu</Link>
    </div>
  )
}
