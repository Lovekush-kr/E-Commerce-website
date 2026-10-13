import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import './HomePage.css'

function HomePage() {
  const [categories, setCategories] = useState([])
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
      fetchProducts({ limit: 30 })
    ])
      .then(([catsData, prodsData]) => {
        // Set categories (top 8 popular categories)
        const cats = Array.isArray(catsData) ? catsData.slice(0, 8) : []
        setCategories(cats)

        const products = prodsData?.products || []

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
      fetchProducts({ limit: 30 })
    ])
      .then(([catsData, prodsData]) => {
        if (ignore) return

        const cats = Array.isArray(catsData) ? catsData.slice(0, 8) : []
        setCategories(cats)

        const products = prodsData?.products || []

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
      {/* 1. Promotional Hero Section */}
      <section className="hero-banner">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-tag badge">Curated Luxury &bull; Autumn 2026</span>
            <h1 className="hero-heading">
              Elegance Reimagined in <span className="highlight-ruby">Ruby</span> &amp; <span className="highlight-tyrian">Tyrian Purple</span>
            </h1>
            <p className="hero-lead">
              Discover iconic fragrances, couture beauty, advanced tech, and modern home essentials designed for discerning tastes.
            </p>
            <div className="hero-btn-group">
              <Link to="/products" className="btn btn-primary hero-cta">
                Shop Collection &rarr;
              </Link>
              <a href="#featured-categories" className="btn btn-secondary hero-secondary-cta">
                Explore Categories
              </a>
            </div>
          </div>
        </div>
      </section>

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
                  <span className="badge badge-ruby">Limited Time Offers</span>
                  <h3 className="promo-heading">Special Discounts on Premium Brands</h3>
                  <p className="promo-sub">
                    Save up to 25% on signature beauty collections and mobile accessories today.
                  </p>
                </div>
                <Link to="/products" className="btn btn-primary promo-btn">
                  Claim Deals Now &rarr;
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
