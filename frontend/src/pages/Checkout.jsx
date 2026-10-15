import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', address: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  if (items.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Back to menu</Link>
      </div>
    )
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.address.trim()) next.address = 'Address is required'
    if (!/^\d{7,15}$/.test(form.phone)) next.phone = 'Enter a valid phone number (7-15 digits)'
    return next
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setServerError(null)

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    try {
      const res = await api.post('/api/orders', {
        items: items.map((item) => ({ menuItemId: item.id, qty: item.qty })),
        delivery: form
      })
      clear()
      navigate(`/order/${res.data.id}`)
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p role="alert">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" value={form.address} onChange={handleChange} />
          {errors.address && <p role="alert">{errors.address}</p>}
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
          {errors.phone && <p role="alert">{errors.phone}</p>}
        </div>
        <p>Total: ${total.toFixed(2)}</p>
        <button type="submit" disabled={submitting}>Place order</button>
        {serverError && <p role="alert">{serverError}</p>}
      </form>
    </div>
  )
}
