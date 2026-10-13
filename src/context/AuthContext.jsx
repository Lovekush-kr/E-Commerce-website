import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const AUTH_STORAGE_KEY = 'aura_luxe_user'

/**
 * AuthProvider component managing simple mock user authentication state
 */
export function AuthProvider({ children }) {
  // Initialize user from LocalStorage safely
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (err) {
      console.error('Failed to parse user from LocalStorage:', err)
      return null
    }
  })

  // Synchronize user changes to LocalStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    } catch (err) {
      console.error('Failed to update user in LocalStorage:', err)
    }
  }, [user])

  /**
   * Mock Sign In
   * @param {Object} userData - { name: string, email: string }
   */
  const login = (userData) => {
    const newUser = {
      name: userData?.name?.trim() || 'Eleanor Vance',
      email: userData?.email?.trim() || 'eleanor@example.com',
      avatarInitial: (userData?.name?.trim() || 'E').charAt(0).toUpperCase(),
    }
    setUser(newUser)
  }

  /**
   * Mock Sign Out
   */
  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isLoggedIn: Boolean(user),
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to consume AuthContext
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

