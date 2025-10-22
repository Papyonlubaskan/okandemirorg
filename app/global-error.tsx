'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Global error logged for monitoring
    if (process.env.NODE_ENV === 'development') {
      // Error tracked in development
    }
  }, [error])

  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Bir Hata Oluştu - Okan Demir</title>
        <style>{`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
          }
          .container {
            max-width: 28rem;
            width: 100%;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            text-align: center;
          }
          .icon-container {
            width: 5rem;
            height: 5rem;
            background: #fee2e2;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
          }
          h1 {
            font-size: 1.875rem;
            font-weight: 900;
            color: #111827;
            margin-bottom: 1rem;
          }
          p {
            color: #6b7280;
            margin-bottom: 2rem;
          }
          button, a {
            display: block;
            width: 100%;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 900;
            text-decoration: none;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            font-size: 1rem;
          }
          .btn-primary {
            background: #2563eb;
            color: white;
            margin-bottom: 1rem;
          }
          .btn-primary:hover {
            background: #1d4ed8;
          }
          .btn-secondary {
            background: #e5e7eb;
            color: #111827;
            margin-bottom: 1rem;
          }
          .btn-secondary:hover {
            background: #d1d5db;
          }
          .support-link {
            color: #2563eb;
            text-decoration: none;
            font-weight: 900;
            font-size: 0.875rem;
          }
          .support-link:hover {
            text-decoration: underline;
          }
          .error-details {
            background: #fee2e2;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1.5rem;
            text-align: left;
          }
          .error-details p {
            font-family: monospace;
            font-size: 0.875rem;
            color: #991b1b;
            word-break: break-all;
            margin: 0;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon-container">
            <svg
              style={{ width: '2.5rem', height: '2.5rem', color: '#dc2626' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1>Kritik Hata</h1>
          
          <p>
            Sistemde kritik bir hata oluştu. Lütfen sayfayı yenileyin.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="error-details">
              <p>{error.message}</p>
            </div>
          )}

          <button onClick={reset} className="btn-primary">
            Sayfayı Yenile
          </button>
          
          <button onClick={() => window.location.href = '/'} className="btn-secondary">
            Ana Sayfa
          </button>
          
          <a href="https://wa.me/+905552677739" className="support-link">
            Destek Al
          </a>
        </div>
      </body>
    </html>
  )
}
