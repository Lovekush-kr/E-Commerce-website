import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'aura_luxe_cart'

/**
 * CartProvider component managing cart state and LocalStorage persistence
 */
export function CartProvider({ children }) {
  // Initialize cart state safely from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (err) {
      console.error('Failed to load cart from LocalStorage:', err)
      return []
    }
  })

  // Synchronize cartItems changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (err) {
      console.error('Failed to persist cart to LocalStorage:', err)
    }
  }, [cartItems])

  /**
   * Add a product to the cart or increment quantity if already present
   * @param {Object} product
   * @param {number} [quantity=1]
   */
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return

    const qtyToAdd = Math.max(1, parseInt(quantity, 10) || 1)

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingIndex > -1) {
        // Update existing item quantity
        return prevItems.map((item, index) => {
          if (index === existingIndex) {
            const maxStock = item.stock || 99
            const newQty = Math.min(maxStock, item.quantity + qtyToAdd)
            return { ...item, quantity: newQty }
          }
          return item
        })
      } else {
        // Add new item to cart
        const newItem = {
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          discountPercentage: product.discountPercentage || 0,
          thumbnail: product.thumbnail || product.images?.[0] || '',
          category: product.category || '',
          brand: product.brand || '',
          stock: product.stock || 99,
          quantity: Math.min(product.stock || 99, qtyToAdd),
        }
        return [...prevItems, newItem]
      }
    })
  }

  /**
   * Remove an item from the cart by its product ID
   * @param {number|string} productId
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  /**
   * Update quantity of an existing cart item
   * @param {number|string} productId
   * @param {number} newQuantity
   */
  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10)

    if (isNaN(qty) || qty <= 0) {
      // If quantity is zero or less, remove item
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock || 99
          return { ...item, quantity: Math.min(maxStock, qty) }
        }
        return item
      })
    )
  }

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setCartItems([])
  }

  // Derived calculations: Total items and subtotal
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const contextValue = {
    cartItems,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Custom hook to access CartContext
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export default CartContext
