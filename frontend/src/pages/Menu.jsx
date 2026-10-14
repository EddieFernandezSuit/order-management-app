import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Menu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/menu')
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Menu</h1>
      {items.map(item => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.price}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}