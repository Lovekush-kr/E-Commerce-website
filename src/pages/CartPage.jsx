import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './CartPage.css'

function CartPage() {
  const {
    cartItems,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty-container">
          <div className="card-surface cart-empty-card">
            <span className="empty-cart-icon" aria-hidden="true">🛒</span>
            <span className="badge badge-ruby empty-cart-badge">Your Bag is Empty</span>
            <h1 className="empty-cart-title">Your Shopping Cart is Empty</h1>
            <p className="empty-cart-desc">
              Looks like you haven&apos;t added any luxury essentials to your bag yet. Explore our curated collections to get started.
            </p>
            <div className="empty-cart-actions">
              <Link to="/products" className="btn btn-primary">
                Explore All Products &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      {/* Header Banner */}
      <section className="cart-header">
        <div className="container">
          <span className="badge badge-ruby">Your Selection</span>
          <h1 className="cart-title">
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <p className="cart-subtitle">
            Review your items and proceed to checkout whenever you are ready.
          </p>
        </div>
      </section>

      <div className="container cart-layout">
        <div className="cart-grid">
          {/* Left Column: Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-items-card card-surface">
              <div className="cart-items-header">
                <span className="col-product">Product</span>
                <span className="col-price">Price</span>
                <span className="col-qty">Quantity</span>
                <span className="col-total">Subtotal</span>
                <span className="col-remove" aria-hidden="true"></span>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => {
                  const itemSubtotal = (item.price * item.quantity).toFixed(2)

                  return (
                    <article key={item.id} className="cart-item-row">
                      {/* Product Thumbnail & Details */}
                      <div className="item-info">
                        <Link
                          to={`/products/${item.id}`}
                          className="item-thumb-link"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="item-thumb-img"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/100x100/260017/F7F2F5?text=Item'
                            }}
                          />
                        </Link>
                        <div className="item-text">
                          {item.category && (
                            <span className="item-category-tag">{item.category}</span>
                          )}
                          <h3 className="item-title">
                            <Link to={`/products/${item.id}`}>{item.title}</Link>
                          </h3>
                          {item.brand && (
                            <span className="item-brand">{item.brand}</span>
                          )}
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="item-price">
                        <span className="mobile-label">Price:</span>
                        <span className="price-val">${Number(item.price).toFixed(2)}</span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="item-quantity">
                        <span className="mobile-label">Quantity:</span>
                        <div className="qty-stepper">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity for ${item.title}`}
                          >
                            –
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.stock || 99}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            className="qty-input"
                            aria-label={`Quantity for ${item.title}`}
                          />
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.stock || 99)}
                            aria-label={`Increase quantity for ${item.title}`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="item-total">
                        <span className="mobile-label">Total:</span>
                        <span className="total-val">${itemSubtotal}</span>
                      </div>

                      {/* Remove Button */}
                      <div className="item-remove">
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* Bottom Actions Row */}
              <div className="cart-card-footer">
                <Link to="/products" className="btn btn-secondary continue-shopping-btn">
                  ← Continue Shopping
                </Link>
                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
                      clearCart()
                    }
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <aside className="cart-summary-section">
            <div className="summary-card card-surface">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-label">Items Subtotal ({totalItems})</span>
                  <span className="summary-val">${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Standard Shipping</span>
                  <span className="summary-val free-badge">FREE</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Estimated Tax</span>
                  <span className="summary-val">$0.00</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span className="total-label">Estimated Total</span>
                  <span className="total-amount">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-actions">
                <Link to="/checkout" className="btn btn-primary checkout-btn">
                  Proceed to Checkout &rarr;
                </Link>
                <p className="summary-note">
                  Taxes and final details confirmed in demo checkout.
                </p>
              </div>

              <div className="trust-perks">
                <div className="trust-perk-item">
                  <span className="trust-icon" aria-hidden="true">🔒</span>
                  <span>Secure 256-Bit SSL Demo Checkout</span>
                </div>
                <div className="trust-perk-item">
                  <span className="trust-icon" aria-hidden="true">🚚</span>
                  <span>Free Express Delivery on all orders</span>
                </div>
                <div className="trust-perk-item">
                  <span className="trust-icon" aria-hidden="true">↩</span>
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CartPage
