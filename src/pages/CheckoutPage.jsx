import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './CheckoutPage.css'

function CheckoutPage() {
  const { cartItems, totalItems, subtotal, clearCart } = useCart()
  const { user } = useAuth()

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    deliveryNotes: '',
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [completedOrder, setCompletedOrder] = useState(null)

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear field-level error as user edits
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Form Validation
  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address.'
    }

    const phoneRegex = /^[0-9+\s\-()]{7,}$/
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please provide a valid phone number (at least 7 digits).'
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errors.address = 'Please enter your street address (at least 5 characters).'
    }

    if (!formData.city.trim()) {
      errors.city = 'Please enter your city.'
    }

    if (!formData.state.trim()) {
      errors.state = 'Please enter your state or province.'
    }

    if (!formData.postalCode.trim() || formData.postalCode.trim().length < 3) {
      errors.postalCode = 'Please enter a valid postal or ZIP code.'
    }

    return errors
  }

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    // Simulate mock order placement
    setTimeout(() => {
      // Generate clean mock order identifier
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      const orderNumber = `AURA-${new Date().getFullYear()}-${randomSuffix}`

      const placedOrder = {
        orderNumber,
        items: [...cartItems],
        totalItems,
        subtotal,
        customer: { ...formData },
        createdAt: new Date().toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setCompletedOrder(placedOrder)
      setIsSubmitted(true)
      setIsSubmitting(false)
      clearCart() // Clear cart upon successful demo order placement
    }, 400)
  }

  // 1. Order Confirmation View
  if (isSubmitted && completedOrder) {
    return (
      <div className="checkout-page">
        <div className="container confirmation-container">
          <div className="card-surface confirmation-card">
            <div className="confirmation-badge-icon" aria-hidden="true">✓</div>
            <span className="badge badge-ruby">Demo Order Placed</span>
            <h1 className="confirmation-title">Thank You for Your Order!</h1>
            <p className="confirmation-sub">
              Your mock order has been accepted and recorded.
            </p>

            {/* Generated Order Number Box */}
            <div className="order-number-box">
              <span className="order-number-label">Order Reference Number</span>
              <strong className="order-number-val">#{completedOrder.orderNumber}</strong>
              <span className="order-date-text">Placed on {completedOrder.createdAt}</span>
            </div>

            {/* Demo Notice */}
            <div className="demo-notice-alert">
              <strong>Notice:</strong> This is a frontend demo application. No real payment was charged and no physical package will be shipped.
            </div>

            {/* Customer Details Summary */}
            <div className="confirmation-details-grid">
              <div className="conf-detail-col">
                <h3 className="conf-col-title">Customer Contact</h3>
                <p><strong>Name:</strong> {completedOrder.customer.fullName}</p>
                <p><strong>Email:</strong> {completedOrder.customer.email}</p>
                <p><strong>Phone:</strong> {completedOrder.customer.phone}</p>
              </div>

              <div className="conf-detail-col">
                <h3 className="conf-col-title">Shipping Address</h3>
                <p>{completedOrder.customer.address}</p>
                <p>
                  {completedOrder.customer.city}, {completedOrder.customer.state} {completedOrder.customer.postalCode}
                </p>
                {completedOrder.customer.deliveryNotes && (
                  <p className="conf-notes">
                    <em>Notes: {completedOrder.customer.deliveryNotes}</em>
                  </p>
                )}
              </div>
            </div>

            {/* Items Purchased Summary */}
            <div className="conf-items-section">
              <h3 className="conf-col-title">Items Ordered ({completedOrder.totalItems})</h3>
              <div className="conf-items-list">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="conf-item-row">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="conf-item-thumb"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/60x60/260017/F7F2F5?text=Item'
                      }}
                    />
                    <div className="conf-item-name">
                      <span className="item-title-text">{item.title}</span>
                      <span className="item-qty-text">Qty: {item.quantity}</span>
                    </div>
                    <span className="conf-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="conf-total-row">
                <span>Total Paid:</span>
                <span className="conf-total-val">${completedOrder.subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <Link to="/products" className="btn btn-primary continue-shopping-cta">
                Continue Shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Empty Cart Guard View
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container confirmation-container">
          <div className="card-surface empty-checkout-card">
            <span className="empty-checkout-icon" aria-hidden="true">🛒</span>
            <h1 className="empty-checkout-title">Your Cart is Empty</h1>
            <p className="empty-checkout-desc">
              You do not have any items in your cart to checkout. Please explore our catalog and add products before proceeding.
            </p>
            <Link to="/products" className="btn btn-primary">
              Discover Products &rarr;
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 3. Checkout Form & Order Summary View
  return (
    <div className="checkout-page">
      <section className="checkout-header">
        <div className="container">
          <span className="badge badge-ruby">Checkout Demo</span>
          <h1 className="checkout-title">Complete Your Order</h1>
          <p className="checkout-subtitle">
            Provide your contact and shipping information to finalize your mock purchase.
          </p>
        </div>
      </section>

      <div className="container checkout-layout">
        <div className="checkout-grid">
          {/* Left Column: Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form card-surface" noValidate>
              <h2 className="form-section-heading">1. Customer Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`form-input ${formErrors.fullName ? 'input-error' : ''}`}
                    placeholder="e.g. Eleanor Vance"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                  {formErrors.fullName && (
                    <span className="field-error-text" role="alert">{formErrors.fullName}</span>
                  )}
                </div>
              </div>

              <div className="form-row form-two-col">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="req-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                    placeholder="eleanor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <span className="field-error-text" role="alert">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number <span className="req-star">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                  />
                  {formErrors.phone && (
                    <span className="field-error-text" role="alert">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <h2 className="form-section-heading shipping-heading">2. Shipping Destination</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Street Address <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`form-input ${formErrors.address ? 'input-error' : ''}`}
                    placeholder="124 Velvet Avenue, Suite 400"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                  {formErrors.address && (
                    <span className="field-error-text" role="alert">{formErrors.address}</span>
                  )}
                </div>
              </div>

              <div className="form-row form-three-col">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">
                    City <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`form-input ${formErrors.city ? 'input-error' : ''}`}
                    placeholder="New York"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                  />
                  {formErrors.city && (
                    <span className="field-error-text" role="alert">{formErrors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="state" className="form-label">
                    State / Province <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className={`form-input ${formErrors.state ? 'input-error' : ''}`}
                    placeholder="NY"
                    value={formData.state}
                    onChange={handleChange}
                    autoComplete="address-level1"
                  />
                  {formErrors.state && (
                    <span className="field-error-text" role="alert">{formErrors.state}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode" className="form-label">
                    Postal Code <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className={`form-input ${formErrors.postalCode ? 'input-error' : ''}`}
                    placeholder="10001"
                    value={formData.postalCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                  />
                  {formErrors.postalCode && (
                    <span className="field-error-text" role="alert">{formErrors.postalCode}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryNotes" className="form-label">
                    Delivery Instructions <span className="optional-tag">(Optional)</span>
                  </label>
                  <textarea
                    id="deliveryNotes"
                    name="deliveryNotes"
                    className="form-textarea"
                    placeholder="Leave with doorman, gate code #1234, etc."
                    rows="3"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="form-demo-disclaimer">
                <p>
                  <strong>🔒 Prototype Simulation:</strong> No real credit card or payment information is required. Clicking the button below confirms this demo order.
                </p>
              </div>

              <div className="form-submit-row">
                <button
                  type="submit"
                  className="btn btn-primary place-order-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing Order...' : `Place Demo Order • $${subtotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="checkout-summary-section">
            <div className="summary-card card-surface">
              <div className="summary-header-row">
                <h2 className="summary-title">Order Items</h2>
                <Link to="/cart" className="edit-cart-link">
                  Edit Cart
                </Link>
              </div>

              <div className="checkout-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-item-item">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="checkout-item-thumb"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/50x50/260017/F7F2F5?text=Item'
                      }}
                    />
                    <div className="checkout-item-info">
                      <h4 className="checkout-item-name">{item.title}</h4>
                      <span className="checkout-item-qty">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</span>
                    </div>
                    <span className="checkout-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-calc-rows">
                <div className="summary-calc-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-calc-row">
                  <span>Express Shipping</span>
                  <span className="free-badge">FREE</span>
                </div>
                <div className="summary-calc-row">
                  <span>Taxes (Simulated)</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-calc-row total-row">
                  <span>Total Amount</span>
                  <span className="total-amount">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
