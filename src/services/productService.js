/**
 * Centralized Product API Service
 * Interacts with DummyJSON endpoints for products and categories.
 */

const BASE_URL = 'https://dummyjson.com'

/**
 * Reusable helper for API fetch requests with error handling
 * @param {string} endpoint - API endpoint starting with '/'
 * @returns {Promise<any>}
 */
async function apiRequest(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Request to ${endpoint} failed:`, error)
    throw error
  }
}

/**
 * Fetch a list of products with optional pagination
 * @param {Object} options
 * @param {number} [options.limit=30]
 * @param {number} [options.skip=0]
 * @returns {Promise<{products: Array, total: number, skip: number, limit: number}>}
 */
export async function fetchProducts({ limit = 30, skip = 0 } = {}) {
  return apiRequest(`/products?limit=${limit}&skip=${skip}`)
}

/**
 * Fetch a single product by its numeric ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchProductById(id) {
  if (!id) {
    throw new Error('Product ID is required')
  }
  return apiRequest(`/products/${id}`)
}

/**
 * Fetch all product categories with metadata (slug, name, url)
 * @returns {Promise<Array<{slug: string, name: string, url: string}>>}
 */
export async function fetchCategories() {
  return apiRequest('/products/categories')
}

/**
 * Fetch category slug strings list
 * @returns {Promise<Array<string>>}
 */
export async function fetchCategoryList() {
  return apiRequest('/products/category-list')
}

/**
 * Fetch products belonging to a specific category
 * @param {string} category - Category slug
 * @param {Object} options
 * @param {number} [options.limit=30]
 * @param {number} [options.skip=0]
 * @returns {Promise<{products: Array, total: number, skip: number, limit: number}>}
 */
export async function fetchProductsByCategory(category, { limit = 30, skip = 0 } = {}) {
  if (!category) {
    throw new Error('Category name is required')
  }
  const encodedCategory = encodeURIComponent(category)
  return apiRequest(`/products/category/${encodedCategory}?limit=${limit}&skip=${skip}`)
}

/**
 * Search products by keyword
 * @param {string} query - Search term
 * @param {Object} options
 * @param {number} [options.limit=30]
 * @param {number} [options.skip=0]
 * @returns {Promise<{products: Array, total: number, skip: number, limit: number}>}
 */
export async function searchProducts(query, { limit = 30, skip = 0 } = {}) {
  const encodedQuery = encodeURIComponent(query || '')
  return apiRequest(`/products/search?q=${encodedQuery}&limit=${limit}&skip=${skip}`)
}

