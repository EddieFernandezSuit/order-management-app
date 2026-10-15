import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, setQty, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Back to menu</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
            <button
              type="button"
              aria-label={`Decrease quantity of ${item.name}`}
              onClick={() => setQty(item.id, item.qty - 1)}
            >
              -
            </button>
            <span data-testid={`qty-${item.id}`}>{item.qty}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${item.name}`}
              onClick={() => setQty(item.id, item.qty + 1)}
            >
              +
            </button>
            <span>${(item.price * item.qty).toFixed(2)}</span>
            <button
              type="button"
              aria-label={`Remove ${item.name}`}
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total: ${total.toFixed(2)}</p>
      <Link to="/checkout">Proceed to checkout</Link>
    </div>
  )
}
