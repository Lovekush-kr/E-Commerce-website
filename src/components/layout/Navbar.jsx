import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../common/AuthModal'
import './Navbar.css'

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem('aura_luxe_theme') === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  const { totalItems } = useCart()
  const { user, isLoggedIn, logout } = useAuth()

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('aura_luxe_theme', theme)
    } catch {
      // The theme remains active for this visit if storage is unavailable.
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <span className="brand-gem" aria-hidden="true">◆</span>
            <span className="brand-name">AURA</span>
            <span className="brand-accent">LUXE</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar-nav desktop-nav" aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Products
            </NavLink>
          </nav>

          {/* Right side utilities: Cart & Mock Auth */}
          <div className="navbar-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            >
              <span aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
              <span className="theme-toggle-label">
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
              </span>
            </button>

            {/* Desktop Auth State */}
            <div className="desktop-auth-wrap">
              {isLoggedIn ? (
                <div className="logged-in-group">
                  <div className="user-profile-pill" title={`Signed in as ${user.email}`}>
                    <span className="user-avatar" aria-hidden="true">
                      {user.avatarInitial}
                    </span>
                    <span className="user-firstname">
                      {user.name.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="auth-link-btn"
                    onClick={logout}
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary sign-in-btn"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              className="action-link cart-action"
              aria-label={`View shopping cart, ${totalItems} items`}
              onClick={closeMobileMenu}
            >
              <span className="action-icon" aria-hidden="true">🛒</span>
              <span className="action-label">Cart</span>
              <span className="action-badge">{totalItems}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="mobile-toggle-btn"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={toggleMobileMenu}
            >
              <span className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}>
            <nav
              className="mobile-nav"
              aria-label="Mobile navigation"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User mobile banner */}
              <div className="mobile-auth-banner">
                {isLoggedIn ? (
                  <div className="mobile-user-row">
                    <span className="mobile-user-info">
                      Signed in as <strong>{user.name}</strong>
                    </span>
                    <button
                      type="button"
                      className="mobile-signout-btn"
                      onClick={() => {
                        logout()
                        closeMobileMenu()
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary mobile-signin-btn"
                    onClick={() => {
                      setAuthModalOpen(true)
                      closeMobileMenu()
                    }}
                  >
                    Sign In Demo Account
                  </button>
                )}
              </div>

              <NavLink
                to="/"
                end
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                All Products
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                Shopping Cart ({totalItems})
              </NavLink>
            </nav>
          </div>
        )}
      </header>

      {/* Demo Sign In Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  )
}

export default Navbar
