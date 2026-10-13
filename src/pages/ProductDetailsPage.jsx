import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProductById } from '../services/productService'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import './ProductDetailsPage.css'

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [actionFeedback, setActionFeedback] = useState(null)

  // Manual retry handler
  const loadProduct = () => {
    setLoading(true)
    setError(null)
    setActionFeedback(null)

    Promise.resolve()
      .then(() => {
        if (!id || isNaN(Number(id))) {
          throw new Error('Invalid product ID provided')
        }
        return fetchProductById(id)
      })
      .then((data) => {
        if (!data || !data.id) {
          throw new Error('Product not found')
        }
        setProduct(data)
        setActiveImageIndex(0)
        setQuantity(1)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load product details')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    let ignore = false

    Promise.resolve()
      .then(() => {
        if (!id || isNaN(Number(id))) {
          throw new Error('Invalid product ID provided')
        }
        return fetchProductById(id)
      })
      .then((data) => {
        if (!ignore) {
          if (!data || !data.id) {
            setError('Product not found')
          } else {
            setProduct(data)
            setActiveImageIndex(0)
            setQuantity(1)
          }
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Failed to load product details')
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [id])

  // Quantity controls
  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleQuantityIncrease = () => {
    const maxStock = product?.stock || 99
    setQuantity((prev) => Math.min(maxStock, prev + 1))
  }

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10)
    const maxStock = product?.stock || 99
    if (isNaN(val) || val < 1) {
      setQuantity(1)
    } else if (val > maxStock) {
      setQuantity(maxStock)
    } else {
      setQuantity(val)
    }
  }

  // Shopping action handlers
  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, quantity)
    setActionFeedback({
      type: 'cart',
      message: `Added ${quantity} × "${product.title}" to your cart!`,
    })
  }

  const handleBuyNow = () => {
    if (!product) return
    addToCart(product, quantity)
    navigate('/checkout')
  }

  // Fallback image helper
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/600x600/260017/F7F2F5?text=Image+Unavailable'
  }

  // Loading State
  if (loading) {
    return (
      <div className="container product-details-state">
        <LoadingSpinner message="Loading product details..." size="lg" />
      </div>
    )
  }

  // Error / Invalid ID / Not Found State
  if (error || !product) {
    return (
      <div className="container product-details-state">
        <div className="card-surface error-wrapper">
          <ErrorMessage
            message={error || 'Unable to display product.'}
            onRetry={loadProduct}
          />
          <div className="error-actions">
            <Link to="/products" className="btn btn-secondary">
              ← Return to All Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Image list with fallback
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.thumbnail || 'https://placehold.co/600x600/260017/F7F2F5?text=No+Image']

  const activeImage = images[activeImageIndex] || product.thumbnail

  // Pricing calculations
  const price = Number(product.price) || 0
  const discount = Number(product.discountPercentage) || 0
  const hasDiscount = discount > 0
  const originalPrice = hasDiscount
    ? (price / (1 - discount / 100)).toFixed(2)
    : null
  const savings = originalPrice
    ? (Number(originalPrice) - price).toFixed(2)
    : null

  return (
    <div className="product-details-page">
      {/* 1. Breadcrumbs */}
      <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
        <div className="container">
          <ol className="breadcrumbs-list">
            <li><Link to="/">Home</Link></li>
            <li><span className="crumb-sep">/</span></li>
            <li><Link to="/products">Products</Link></li>
            {product.category && (
              <>
                <li><span className="crumb-sep">/</span></li>
                <li>
                  <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
                    {product.category}
                  </Link>
                </li>
              </>
            )}
            <li><span className="crumb-sep">/</span></li>
            <li className="active-crumb" aria-current="page">{product.title}</li>
          </ol>
        </div>
      </nav>

      <div className="container details-layout">
        {/* Main 2-column showcase: Gallery & Purchasing Details */}
        <div className="product-main-showcase">
          {/* Gallery Column */}
          <div className="product-gallery">
            {/* Main Featured Image */}
            <div className="gallery-main-frame card-surface">
              <img
                src={activeImage}
                alt={product.title}
                className="gallery-main-img"
                onError={handleImageError}
              />
              {hasDiscount && (
                <span className="gallery-discount-badge badge badge-ruby">
                  -{Math.round(discount)}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails list if multiple images exist */}
            {images.length > 1 && (
              <div className="gallery-thumbnails" role="tablist" aria-label="Product image thumbnails">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={activeImageIndex === idx}
                    aria-label={`View image ${idx + 1} of ${images.length}`}
                    className={`thumb-btn ${activeImageIndex === idx ? 'thumb-active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="thumb-img"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Shopping Column */}
          <div className="product-info-panel">
            {/* Category & Brand tags */}
            <div className="product-badges">
              {product.category && (
                <Link
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                  className="badge"
                >
                  {product.category}
                </Link>
              )}
              {product.brand && (
                <span className="brand-tag">
                  By <strong>{product.brand}</strong>
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="details-title">{product.title}</h1>

            {/* Rating & Review summary */}
            <div className="details-rating-row">
              {product.rating !== undefined && (
                <div className="rating-badge" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                  <span className="star-icon" aria-hidden="true">★</span>
                  <span className="rating-num">{Number(product.rating).toFixed(1)}</span>
                </div>
              )}
              {Array.isArray(product.reviews) && product.reviews.length > 0 && (
                <span className="reviews-count-text">
                  ({product.reviews.length} customer {product.reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              )}
              {product.availabilityStatus && (
                <span className={`stock-status-pill ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.availabilityStatus} ({product.stock} available)
                </span>
              )}
            </div>

            {/* Pricing Section */}
            <div className="details-pricing card-surface">
              <div className="pricing-main-row">
                <span className="details-price">${price.toFixed(2)}</span>
                {originalPrice && (
                  <span className="details-original-price">${originalPrice}</span>
                )}
                {savings && (
                  <span className="savings-chip">Save ${savings}</span>
                )}
              </div>
              {product.minimumOrderQuantity && product.minimumOrderQuantity > 1 && (
                <p className="min-order-note">
                  Minimum Order Quantity: <strong>{product.minimumOrderQuantity} units</strong>
                </p>
              )}
            </div>

            {/* Description */}
            <div className="details-description">
              <h2 className="section-subheading">Description</h2>
              <p className="description-text">{product.description}</p>
            </div>

            {/* Shopping Controls */}
            <div className="shopping-actions-card card-surface">
              <div className="quantity-control-group">
                <label htmlFor="quantity-input" className="quantity-label">
                  Quantity:
                </label>
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <input
                    id="quantity-input"
                    type="number"
                    min="1"
                    max={product.stock || 99}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                    aria-label="Item quantity"
                  />
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= (product.stock || 99)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-row">
                <button
                  type="button"
                  className="btn btn-secondary add-cart-btn"
                  onClick={handleAddToCart}
                >
                  🛒 Add to Cart
                </button>
                <button
                  type="button"
                  className="btn btn-primary buy-now-btn"
                  onClick={handleBuyNow}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Action Feedback Banner */}
              {actionFeedback && (
                <div className="action-feedback-box" role="status">
                  <p className="feedback-message">✓ {actionFeedback.message}</p>
                  <div className="feedback-action-links">
                    <Link to="/cart" className="btn btn-primary feedback-cart-btn">
                      View Cart &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Specifications & Dimensions Section (Only display provided fields) */}
        <section className="product-specs-section">
          <div className="specs-card card-surface">
            <h2 className="specs-title">Product Specifications</h2>
            <div className="specs-grid">
              {product.brand && (
                <div className="spec-item">
                  <span className="spec-label">Brand</span>
                  <span className="spec-value">{product.brand}</span>
                </div>
              )}
              {product.sku && (
                <div className="spec-item">
                  <span className="spec-label">SKU</span>
                  <span className="spec-value">{product.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="spec-item">
                  <span className="spec-label">Category</span>
                  <span className="spec-value">{product.category}</span>
                </div>
              )}
              {product.weight !== undefined && (
                <div className="spec-item">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{product.weight} kg</span>
                </div>
              )}
              {product.dimensions && (
                <div className="spec-item">
                  <span className="spec-label">Dimensions</span>
                  <span className="spec-value">
                    {product.dimensions.width}W × {product.dimensions.height}H × {product.dimensions.depth}D cm
                  </span>
                </div>
              )}
              {product.warrantyInformation && (
                <div className="spec-item">
                  <span className="spec-label">Warranty</span>
                  <span className="spec-value">{product.warrantyInformation}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="spec-item">
                  <span className="spec-label">Shipping</span>
                  <span className="spec-value">{product.shippingInformation}</span>
                </div>
              )}
              {product.returnPolicy && (
                <div className="spec-item">
                  <span className="spec-label">Return Policy</span>
                  <span className="spec-value">{product.returnPolicy}</span>
                </div>
              )}
            </div>

            {/* Product Tags if available */}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="product-tags-row">
                <span className="tags-label">Tags:</span>
                <div className="tags-list">
                  {product.tags.map((tag, i) => (
                    <span key={i} className="spec-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Customer Reviews Section (Only display when reviews array is present) */}
        {Array.isArray(product.reviews) && product.reviews.length > 0 && (
          <section className="product-reviews-section">
            <div className="reviews-header">
              <h2 className="reviews-title">Customer Reviews</h2>
              <span className="badge badge-ruby">
                {product.reviews.length} Verified {product.reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            <div className="reviews-list">
              {product.reviews.map((rev, index) => (
                <article key={index} className="review-card card-surface">
                  <div className="review-top-bar">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar" aria-hidden="true">
                        {rev.reviewerName ? rev.reviewerName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <h4 className="reviewer-name">{rev.reviewerName || 'Customer'}</h4>
                        {rev.date && (
                          <time className="review-date" dateTime={rev.date}>
                            {new Date(rev.date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </time>
                        )}
                      </div>
                    </div>
                    {rev.rating !== undefined && (
                      <div className="review-stars" aria-label={`Rating: ${rev.rating} stars`}>
                        {Array.from({ length: 5 }, (_, starIdx) => (
                          <span
                            key={starIdx}
                            className={starIdx < rev.rating ? 'star-filled' : 'star-empty'}
                            aria-hidden="true"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="bottom-nav-link">
          <Link to="/products" className="btn btn-secondary">
            ← Back to All Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
