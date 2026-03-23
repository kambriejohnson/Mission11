import { Link } from "react-router-dom"

type CartPageProps = {
  cart: any[]
  removeFromCart: (bookId: number) => void
  clearCart: () => void
  returnPage: number
  returnCategory : string
}

function CartPage({ cart, removeFromCart, clearCart, returnPage, returnCategory }: CartPageProps) {
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cart.map((item: any) => (
              <li key={item.bookId} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <span><strong>{item.title}</strong></span>
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Price: ${item.price.toFixed(2)}</span>
                  <span>Subtotal: ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => removeFromCart(item.bookId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <p className="fw-bold text-center mb-4">
            Total: ${total.toFixed(2)}
          </p>

          <div className="d-flex justify-content-center gap-2">
        <button className="btn btn-outline-secondary" onClick={clearCart}>
            Clear Cart
        </button>

        <Link
        to={`/?page=${returnPage}&category=${encodeURIComponent(returnCategory)}`}
        className="btn btn-primary"
        >
        Continue Shopping
        </Link>

        </div>
        </>
      )}
    </div>
  )
}

export default CartPage