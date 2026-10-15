import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, setQty, removeItem, total } = useCart()

  if (items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>
        <p className="muted">Your cart is empty.</p>
        <Link to="/">Back to menu</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Your Cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <div>
              <strong>{item.name}</strong>
              <div className="desc">${item.price.toFixed(2)} each</div>
            </div>

            <div className="qty-controls">
              <button
                type="button"
                className="btn qty-btn"
                aria-label={`Decrease quantity of ${item.name}`}
                onClick={() => setQty(item.id, item.qty - 1)}
              >
                -
              </button>
              <span data-testid={`qty-${item.id}`}>{item.qty}</span>
              <button
                type="button"
                className="btn qty-btn"
                aria-label={`Increase quantity of ${item.name}`}
                onClick={() => setQty(item.id, item.qty + 1)}
              >
                +
              </button>
            </div>

            <span className="price">${(item.price * item.qty).toFixed(2)}</span>

            <button
              type="button"
              className="btn"
              aria-label={`Remove ${item.name}`}
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <p className="total">Total: ${total.toFixed(2)}</p>
      <Link className="btn btn-primary" to="/checkout">Proceed to checkout</Link>
    </div>
  )
}
