import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '64px 16px', textAlign: 'center' }}>
      <div className="card-surface" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <span className="badge badge-ruby" style={{ marginBottom: '16px' }}>404 Not Found</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Page Not Found</h1>
        <p style={{ marginBottom: '24px' }}>
          The page you requested could not be located. It might have been moved or removed.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to Homepage
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

