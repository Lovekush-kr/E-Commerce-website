import './ErrorMessage.css'

/**
 * Reusable Error Message alert component
 * @param {Object} props
 * @param {string} props.message
 * @param {Function} [props.onRetry]
 */
function ErrorMessage({ message = 'An unexpected error occurred.', onRetry }) {
  return (
    <div className="error-card" role="alert">
      <div className="error-icon" aria-hidden="true">!</div>
      <div className="error-content">
        <h3 className="error-title">Something went wrong</h3>
        <p className="error-description">{message}</p>
        {onRetry && (
          <button type="button" className="btn btn-secondary error-retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage

