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

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Menu</h1>
      <Link to="/cart">Cart ({count})</Link>
      {items.map((item) => (
        <div key={item.id}>
          <img src={item.image} alt={item.name} width={160} />
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <p>${item.price.toFixed(2)}</p>
          <button type="button" onClick={() => addItem(item)}>Add to cart</button>
        </div>
      ))}
    </div>
  )
}