import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import './AuthModal.css'

function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth()

  const [name, setName] = useState('Eleanor Vance')
  const [email, setEmail] = useState('eleanor@example.com')
  const [error, setError] = useState('')

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please provide a name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.')
      return
    }

    login({ name, email })
    setError('')
    onClose()
  }

  const handleQuickLogin = (demoName, demoEmail) => {
    login({ name: demoName, email: demoEmail })
    setError('')
    onClose()
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="auth-modal-card card-surface"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="auth-modal-header">
          <div>
            <span className="badge badge-ruby auth-badge">Demo Account</span>
            <h2 id="auth-modal-title" className="auth-modal-title">Sign In to AURA LUXE</h2>
          </div>
          <button
            type="button"
            className="auth-modal-close"
            onClick={onClose}
            aria-label="Close authentication modal"
          >
            ✕
          </button>
        </div>

        <p className="auth-modal-desc">
          Sign in to test personalized checkout pre-fill and live user state in the header. No real credentials needed.
        </p>

        {error && <div className="auth-error-alert" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form-group">
            <label htmlFor="auth-name" className="auth-label">Full Name</label>
            <input
              type="text"
              id="auth-name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="auth-email" className="auth-label">Email Address</label>
            <input
              type="email"
              id="auth-email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            Sign In with Demo Account
          </button>
        </form>

        <div className="quick-accounts-section">
          <span className="quick-label">Or choose a sample persona:</span>
          <div className="quick-persona-buttons">
            <button
              type="button"
              className="quick-persona-btn"
              onClick={() => handleQuickLogin('Eleanor Vance', 'eleanor@example.com')}
            >
              Eleanor Vance (VIP)
            </button>
            <button
              type="button"
              className="quick-persona-btn"
              onClick={() => handleQuickLogin('Lucas Gordon', 'lucas.gordon@example.com')}
            >
              Lucas Gordon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal

