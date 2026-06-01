import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function FooterSection() {
  const currentYear = new Date().getFullYear()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('fintime_token') || localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <footer
      className="relative py-12 border-t"
      style={{
        background: 'var(--dark)',
        borderColor: 'rgba(0,245,255,0.06)',
      }}
    >
      <div className="container max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: 'rgba(0,245,255,0.1)',
                border: '1px solid rgba(0,245,255,0.3)',
              }}
            >
              ⏱
            </div>
            <div>
              <span
                className="text-xl font-extrabold"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                FinTime
              </span>
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                AI Financial Time Machine
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="text-sm font-medium no-underline transition-colors hover:text-cyan-400"
                style={{ color: 'var(--text-muted)' }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium no-underline transition-colors hover:text-cyan-400"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium no-underline transition-colors hover:text-cyan-400"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Credits */}
          <div className="text-center md:text-right">
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              © {currentYear} FinTime · CC26-PSU411
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
              Coding Camp 2026 — Dicoding × DBS Foundation
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

