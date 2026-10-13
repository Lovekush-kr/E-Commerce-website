import { Link } from 'react-router-dom'
import './ProductCard.css'

/**
 * Reusable Product Card component
 * @param {Object} props
 * @param {Object} props.product - DummyJSON product object
 */
function ProductCard({ product }) {
  if (!product) return null

  const {
    id,
    title,
    price,
    discountPercentage,
    rating,
    thumbnail,
    category,
    brand,
  } = product

  // Calculate approximate original price before discount if discount exists
  const hasDiscount = discountPercentage && discountPercentage > 0
  const originalPrice = hasDiscount
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null

  return (
    <article className="product-card card-surface">
      {/* Product Image Container */}
      <div className="card-image-wrap">
        <Link to={`/products/${id}`} className="card-image-link" tabIndex={-1} aria-hidden="true">
          <img
            src={thumbnail}
            alt={title}
            className="product-image"
            loading="lazy"
          />
        </Link>

        {hasDiscount && (
          <span className="card-discount-badge">
            -{Math.round(discountPercentage)}%
          </span>
        )}
      </div>

      {/* Product Content */}
      <div className="card-details">
        <div className="card-meta">
          <span className="card-category">{category}</span>
          {rating !== undefined && (
            <span className="card-rating" aria-label={`Rated ${rating} out of 5 stars`}>
              <span className="rating-star" aria-hidden="true">★</span>
              <span className="rating-score">{Number(rating).toFixed(1)}</span>
            </span>
          )}
        </div>

        <h3 className="card-title">
          <Link to={`/products/${id}`} title={title}>
            {title}
          </Link>
        </h3>

        {brand && <p className="card-brand">{brand}</p>}

        <div className="card-pricing">
          <span className="current-price">${Number(price).toFixed(2)}</span>
          {originalPrice && (
            <span className="original-price">${originalPrice}</span>
          )}
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          <Link
            to={`/products/${id}`}
            className="btn btn-secondary card-action-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

export default ProductCard

