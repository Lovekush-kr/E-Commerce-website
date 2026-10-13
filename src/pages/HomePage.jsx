import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import heroImage from '../assets/hero.png'
import './HomePage.css'

const promotions = [
  {
    eyebrow: 'Fresh picks',
    title: 'Good things for the everyday',
    description: 'Discover fruit, pantry staples, and useful finds for your kitchen.',
    categories: ['groceries'],
    productTerms: ['apple', 'banana', 'mango', 'orange', 'grape', 'fruit', 'kiwi', 'lemon', 'watermelon'],
    tone: 'rose',
  },
  {
    eyebrow: 'For your space',
    title: 'Make home feel more like yours',
    description: 'Explore furniture and home accents for the spaces you love.',
    categories: ['furniture', 'home-decoration'],
    tone: 'mauve',
  },
  {
    eyebrow: 'A little upgrade',
    title: 'Everyday tech, thoughtfully picked',
    description: 'Find useful devices and accessories for work, play, and life on the go.',
    categories: ['smartphones', 'laptops', 'mobile-accessories', 'tablets'],
    tone: 'plum',
  },
]

function PromotionalCarousel({ products }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [timerReset, setTimerReset] = useState(0)
  const promotionProducts = []

  promotions.forEach((promotion) => {
    const unusedProducts = products.filter((product) =>
      !promotionProducts.some((selected) => selected?.id === product.id)
    )
    const groceryFruit = promotion.productTerms
      ? unusedProducts.find((product) => promotion.productTerms.some((term) =>
        product.title.toLowerCase().includes(term)
      ))
      : null
    const inDepartment = unusedProducts.find((product) =>
      promotion.categories.includes(product.category)
    )
    promotionProducts.push(groceryFruit || inDepartment || unusedProducts[0])
  })

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % promotions.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [paused, timerReset])

  const moveTo = (index) => {
    setActiveSlide((index + promotions.length) % promotions.length)
    setTimerReset((current) => current + 1)
  }

  return (
    <section
      className="promotional-carousel container"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="carousel-window" aria-live="polite">
        <div className="carousel-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
          {promotions.map((promotion, index) => {
            const product = promotionProducts[index]
            return (
              <article className={`carousel-slide carousel-slide-${promotion.tone}`} key={promotion.title}>
                <div className="carousel-copy">
                  <span className="carousel-eyebrow">{promotion.eyebrow}</span>
                  <h2>{promotion.title}</h2>
                  <p>{promotion.description}</p>
                  <Link
                    className="btn carousel-cta"
                    to={product?.category
                      ? `/products?category=${encodeURIComponent(product.category)}`
                      : '/products'}
                  >
                    Shop Now <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="carousel-art" aria-hidden="true">
                  <span className="carousel-orbit" />
                  <img src={product?.thumbnail || heroImage} alt="" />
                  {product && <span className="carousel-product-label">{product.title}</span>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-previous"
        onClick={() => moveTo(activeSlide - 1)}
        aria-label="Previous promotion"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        className="carousel-arrow carousel-arrow-next"
        onClick={() => moveTo(activeSlide + 1)}
        aria-label="Next promotion"
      >
        <span aria-hidden="true">›</span>
      </button>
      <div className="carousel-pagination" aria-label="Choose a promotion">
        {promotions.map((promotion, index) => (
          <button
            type="button"
            key={promotion.title}
            className={`carousel-dot ${activeSlide === index ? 'active' : ''}`}
            aria-label={`Show promotion ${index + 1}: ${promotion.title}`}
            aria-current={activeSlide === index ? 'true' : undefined}
            onClick={() => moveTo(index)}
          />
        ))}
      </div>
    </section>
  )
}

function HomePage() {
  const [categories, setCategories] = useState([])
  const [carouselProducts, setCarouselProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadHomeData = () => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 0 })
    ])
      .then(([catsData, prodsData]) => {
        // Set categories (top 8 popular categories)
        const cats = Array.isArray(catsData) ? catsData.slice(0, 8) : []
        setCategories(cats)

        const products = prodsData?.products || []
        setCarouselProducts(products)

        // Featured products: Top rated items
        const featured = [...products]
          .filter((p) => p.rating >= 3.5)
          .slice(0, 4)
        setFeaturedProducts(featured)

        // Popular products: Items with highest discount percentage
        const popular = [...products]
          .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
          .slice(0, 4)
        setPopularProducts(popular)

        // New arrivals: Items sorted by meta.createdAt (or fallback to id desc)
        const newest = [...products]
          .sort((a, b) => {
            const dateA = a.meta?.createdAt ? new Date(a.meta.createdAt).getTime() : a.id
            const dateB = b.meta?.createdAt ? new Date(b.meta.createdAt).getTime() : b.id
            return dateB - dateA
          })
          .slice(0, 4)
        setNewArrivals(newest)
      })
      .catch((err) => {
        setError(err.message || 'Failed to load store data')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    let ignore = false

    Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 0 })
    ])
      .then(([catsData, prodsData]) => {
        if (ignore) return

        const cats = Array.isArray(catsData) ? catsData.slice(0, 8) : []
        setCategories(cats)

        const products = prodsData?.products || []
        setCarouselProducts(products)

        const featured = [...products]
          .filter((p) => p.rating >= 3.5)
          .slice(0, 4)
        setFeaturedProducts(featured)

        const popular = [...products]
          .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
          .slice(0, 4)
        setPopularProducts(popular)

        const newest = [...products]
          .sort((a, b) => {
            const dateA = a.meta?.createdAt ? new Date(a.meta.createdAt).getTime() : a.id
            const dateB = b.meta?.createdAt ? new Date(b.meta.createdAt).getTime() : b.id
            return dateB - dateA
          })
          .slice(0, 4)
        setNewArrivals(newest)
        setLoading(false)
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Failed to load store data')
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="home-page">
      <section className="home-intro">
        <div className="container home-intro-content">
          <span className="hero-tag badge">A considered collection</span>
          <h1 className="hero-heading">
            Everyday, <span className="highlight-ruby">beautifully</span> considered.
          </h1>
          <p className="hero-lead">
            Discover thoughtful finds for your style, your space, and the moments in between.
          </p>
        </div>
      </section>

      <PromotionalCarousel products={carouselProducts} />

      {/* Value Perks Strip */}
      <section className="perks-strip">
        <div className="container perks-container">
          <div className="perk-item">
            <span className="perk-icon" aria-hidden="true">✦</span>
            <div className="perk-text">
              <h4>Verified Quality</h4>
              <p>Authentic brand essentials</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon" aria-hidden="true">✈</span>
            <div className="perk-text">
              <h4>Global Shipping</h4>
              <p>Fast track delivery</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon" aria-hidden="true">★</span>
            <div className="perk-text">
              <h4>Top Rated</h4>
              <p>Customer verified reviews</p>
            </div>
          </div>
          <div className="perk-item">
            <span className="perk-icon" aria-hidden="true">✔</span>
            <div className="perk-text">
              <h4>Secure Experience</h4>
              <p>Peace of mind guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Loading / Error State for page */}
      {loading && (
        <div className="container home-loading-state">
          <LoadingSpinner message="Curating store collections..." size="lg" />
        </div>
      )}

      {error && (
        <div className="container home-error-state">
          <ErrorMessage message={error} onRetry={loadHomeData} />
        </div>
      )}

      {!loading && !error && (
        <>
          {/* 2. Featured Categories Section */}
          <section id="featured-categories" className="home-section categories-section">
            <div className="container">
              <div className="section-header">
                <div>
                  <span className="section-eyebrow">Browse by Department</span>
                  <h2 className="section-title">Popular Categories</h2>
                </div>
                <Link to="/products" className="section-link">
                  All Categories &rarr;
                </Link>
              </div>

              <div className="category-grid">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/products?category=${encodeURIComponent(cat.slug)}`}
                    className="category-card"
                  >
                    <div className="category-card-content">
                      <span className="category-dot" aria-hidden="true">◆</span>
                      <h3 className="category-name">{cat.name}</h3>
                      <span className="category-browse">Shop department &rarr;</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Featured Products */}
          <section className="home-section featured-section">
            <div className="container">
              <div className="section-header">
                <div>
                  <span className="section-eyebrow">Handpicked Favorites</span>
                  <h2 className="section-title">Featured Products</h2>
                </div>
                <Link to="/products" className="section-link">
                  View Full Catalog &rarr;
                </Link>
              </div>

              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* 4. Promotional Banner Callout */}
          <section className="home-promo-banner">
            <div className="container">
              <div className="promo-box">
                <div className="promo-text">
                  <span className="badge badge-ruby">The AURA edit</span>
                  <h3 className="promo-heading">Find a new favorite</h3>
                  <p className="promo-sub">
                    Explore considered essentials from across the collection.
                  </p>
                </div>
                <Link to="/products" className="btn btn-primary promo-btn">
                  Explore the edit &rarr;
                </Link>
              </div>
            </div>
          </section>

          {/* 5. Popular Products */}
          <section className="home-section popular-section">
            <div className="container">
              <div className="section-header">
                <div>
                  <span className="section-eyebrow">Customer Favorites</span>
                  <h2 className="section-title">Popular Products</h2>
                </div>
                <Link to="/products" className="section-link">
                  See More &rarr;
                </Link>
              </div>

              <div className="product-grid">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* 6. New Arrivals */}
          <section className="home-section new-arrivals-section">
            <div className="container">
              <div className="section-header">
                <div>
                  <span className="section-eyebrow">Just Landed</span>
                  <h2 className="section-title">New Arrivals</h2>
                </div>
                <Link to="/products" className="section-link">
                  Explore Latest &rarr;
                </Link>
              </div>

              <div className="product-grid">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default HomePage
