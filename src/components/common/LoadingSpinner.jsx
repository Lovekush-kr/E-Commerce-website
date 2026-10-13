import './LoadingSpinner.css'

/**
 * Reusable Loading Spinner component
 * @param {Object} props
 * @param {string} [props.message='Loading...']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 */
function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  return (
    <div className={`spinner-container spinner-${size}`} role="status" aria-live="polite">
      <div className="spinner-circle"></div>
      {message && <span className="spinner-message">{message}</span>}
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default LoadingSpinner

