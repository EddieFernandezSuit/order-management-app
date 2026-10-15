import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addItem, count } = useCart()

  useEffect(() => {
    api.get('/api/menu')
      .then((res) => setItems(res.data))
      .catch(() => setError('Failed to load menu'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <header className="topbar">
        <span className="brand">Order Management</span>
        <Link className="cart-link" to="/cart">Cart ({count})</Link>
      </header>

      <h1>Menu</h1>

      {loading && <p className="muted">Loading...</p>}
      {error && <p role="alert" className="alert">{error}</p>}

      <div className="menu-grid">
        {items.map((item) => (
          <article key={item.id} className="menu-card">
            <img src={item.image} alt={item.name} />
            <div className="body">
              <h2>{item.name}</h2>
              <p className="desc">{item.description}</p>
              <span className="price">${item.price.toFixed(2)}</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => addItem(item)}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
