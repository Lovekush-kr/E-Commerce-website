import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Brand & Statement */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-gem" aria-hidden="true">◆</span>
            <span className="brand-name">AURA</span>
            <span className="brand-accent">LUXE</span>
          </div>
          <p className="footer-tagline">
            Curated collections of premium essentials. Crafted with elegance, powered by live catalog data.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Categories preview */}
        <div className="footer-col">
          <h4 className="footer-title">Popular Categories</h4>
          <ul className="footer-links">
            <li><Link to="/products?category=beauty">Beauty</Link></li>
            <li><Link to="/products?category=fragrances">Fragrances</Link></li>
            <li><Link to="/products?category=smartphones">Smartphones</Link></li>
            <li><Link to="/products?category=furniture">Furniture</Link></li>
          </ul>
        </div>

        {/* Demo Disclaimer */}
        <div className="footer-col">
          <h4 className="footer-title">Demo Store</h4>
          <p className="footer-note">
            Built with React, Vite, and DummyJSON. For demonstration purposes only.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="footer-copy">
            &copy; {currentYear} AURA LUXE. All rights reserved.
          </p>
          <p className="footer-notice">
            Designed with considered details.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

