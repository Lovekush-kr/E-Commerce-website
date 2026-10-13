import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/productService'
import ProductCard from '../components/products/ProductCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import './ProductsPage.css'

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // State for raw catalog data
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filter & Search Controls state
  const selectedCategory = searchParams.get('category') || 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minRating, setMinRating] = useState('0')
  const [sortBy, setSortBy] = useState('featured')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch all products and categories
  const loadData = () => {
    setLoading(true)
    setError(null)

    Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 0 }) // Fetch full catalog of 194 products for local search/filter
    ])
      .then(([catsData, prodsData]) => {
        setCategories(Array.isArray(catsData) ? catsData : [])
        setProducts(prodsData?.products || [])
      })
      .catch((err) => {
        setError(err.message || 'Failed to load catalog products')
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
        if (!ignore) {
          setCategories(Array.isArray(catsData) ? catsData : [])
          setProducts(prodsData?.products || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Failed to load catalog products')
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Handle Category Change (updates URL query param)
  const handleCategoryChange = (catSlug) => {
    const nextParams = new URLSearchParams(searchParams)
    if (catSlug === 'all') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', catSlug)
    }
    setSearchParams(nextParams)
  }

  // Clear all filters back to default
  const handleClearFilters = () => {
    setSearchQuery('')
    setMinPrice('')
    setMaxPrice('')
    setMinRating('0')
    setSortBy('featured')
    setSearchParams({})
  }

  // Calculate active filter count for UI indicator
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    selectedCategory !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    minRating !== '0' ||
    sortBy !== 'featured'
  )

  // Derived: Filtered Products
  const filteredProducts = products.filter((product) => {
    // 1. Search Query filter (Case-insensitive matching title, brand, or category)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const titleMatch = product.title?.toLowerCase().includes(query)
      const brandMatch = product.brand?.toLowerCase().includes(query)
      const categoryMatch = product.category?.toLowerCase().includes(query)
      if (!titleMatch && !brandMatch && !categoryMatch) {
        return false
      }
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      if (product.category !== selectedCategory) {
        return false
      }
    }

    // 3. Minimum Price
    if (minPrice !== '' && !isNaN(Number(minPrice))) {
      if (product.price < Number(minPrice)) {
        return false
      }
    }

    // 4. Maximum Price
    if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
      if (product.price > Number(maxPrice)) {
        return false
      }
    }

    // 5. Minimum Rating
    if (minRating !== '0' && !isNaN(Number(minRating))) {
      if ((product.rating || 0) < Number(minRating)) {
        return false
      }
    }

    return true
  })

  // Derived: Sorted Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price
    }
    if (sortBy === 'rating-desc') {
      return (b.rating || 0) - (a.rating || 0)
    }
    if (sortBy === 'newest') {
      const dateA = a.meta?.createdAt ? new Date(a.meta.createdAt).getTime() : a.id
      const dateB = b.meta?.createdAt ? new Date(b.meta.createdAt).getTime() : b.id
      return dateB - dateA
    }
    return 0 // default 'featured' retains natural API catalog ordering
  })

  return (
    <div className="products-page">
      {/* Header Banner */}
      <section className="catalog-header">
        <div className="container">
          <span className="badge badge-ruby">The Complete Catalog</span>
          <h1 className="catalog-title">Explore All Products</h1>
          <p className="catalog-subtitle">
            Browse our full selection of premium beauty, smartphones, fragrances, and luxury lifestyle pieces.
          </p>
        </div>
      </section>

      <div className="container catalog-layout">
        {/* Top Controls Bar: Search & Sort & Mobile Filter Toggle */}
        <div className="catalog-controls-bar card-surface">
          {/* Live Search Input */}
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by product name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products by name"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>

          <div className="controls-right-group">
            {/* Sort Selector */}
            <div className="sort-wrap">
              <label htmlFor="sort-select" className="sort-label">
                Sort by:
              </label>
              <select
                id="sort-select"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Rating: Highest First</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              className="btn btn-secondary mobile-filter-toggle"
              onClick={() => setShowMobileFilters((prev) => !prev)}
              aria-expanded={showMobileFilters}
            >
              <span>⚙ Filters</span>
              {hasActiveFilters && <span className="active-dot">•</span>}
            </button>
          </div>
        </div>

        {/* Main Content: Filter Sidebar + Products Grid */}
        <div className="catalog-content-row">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showMobileFilters ? 'show-mobile' : ''}`}>
            <div className="filters-card card-surface">
              <div className="filters-header">
                <h3 className="filters-title">Filter Catalog</h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="clear-filters-link"
                    onClick={handleClearFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div className="filter-group">
                <label htmlFor="category-select" className="filter-group-title">
                  Category
                </label>
                <select
                  id="category-select"
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Price Range Filter */}
              <div className="filter-group">
                <span className="filter-group-title">Price Range ($)</span>
                <div className="price-inputs-row">
                  <input
                    type="number"
                    className="price-input"
                    placeholder="Min"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    aria-label="Minimum price in dollars"
                  />
                  <span className="price-divider">&ndash;</span>
                  <input
                    type="number"
                    className="price-input"
                    placeholder="Max"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    aria-label="Maximum price in dollars"
                  />
                </div>
              </div>

              {/* 3. Minimum Rating Filter */}
              <div className="filter-group">
                <span className="filter-group-title">Minimum Rating</span>
                <div className="rating-options">
                  {[
                    { label: 'All Ratings', value: '0' },
                    { label: '3★ & above', value: '3' },
                    { label: '4★ & above', value: '4' },
                    { label: '4.5★ & above', value: '4.5' },
                  ].map((option) => (
                    <label key={option.value} className="rating-radio-label">
                      <input
                        type="radio"
                        name="minRating"
                        value={option.value}
                        checked={minRating === option.value}
                        onChange={(e) => setMinRating(e.target.value)}
                        className="rating-radio"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-secondary reset-all-btn"
                  onClick={handleClearFilters}
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Catalog Listing Area */}
          <main className="catalog-main" aria-live="polite">
            {/* Status counts & Active chips */}
            <div className="catalog-meta-bar">
              <span className="results-count">
                Showing <strong>{sortedProducts.length}</strong> of {products.length} products
              </span>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="active-chips">
                  {searchQuery && (
                    <span className="filter-chip">
                      Search: &ldquo;{searchQuery}&rdquo;
                      <button type="button" onClick={() => setSearchQuery('')} aria-label="Remove search filter">✕</button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="filter-chip">
                      Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                      <button type="button" onClick={() => handleCategoryChange('all')} aria-label="Remove category filter">✕</button>
                    </span>
                  )}
                  {minPrice !== '' && (
                    <span className="filter-chip">
                      Min: ${minPrice}
                      <button type="button" onClick={() => setMinPrice('')} aria-label="Remove minimum price filter">✕</button>
                    </span>
                  )}
                  {maxPrice !== '' && (
                    <span className="filter-chip">
                      Max: ${maxPrice}
                      <button type="button" onClick={() => setMaxPrice('')} aria-label="Remove maximum price filter">✕</button>
                    </span>
                  )}
                  {minRating !== '0' && (
                    <span className="filter-chip">
                      Rating: {minRating}★+
                      <button type="button" onClick={() => setMinRating('0')} aria-label="Remove rating filter">✕</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="catalog-loading">
                <LoadingSpinner message="Fetching live catalog from DummyJSON..." size="lg" />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="catalog-error">
                <ErrorMessage message={error} onRetry={loadData} />
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && sortedProducts.length === 0 && (
              <div className="catalog-empty card-surface">
                <div className="empty-icon" aria-hidden="true">🔍</div>
                <h3 className="empty-title">No products match your criteria</h3>
                <p className="empty-desc">
                  We could not find any products matching your current search or filter combinations.
                </p>
                <button
                  type="button"
                  className="btn btn-primary empty-btn"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && sortedProducts.length > 0 && (
              <div className="catalog-products-grid">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
