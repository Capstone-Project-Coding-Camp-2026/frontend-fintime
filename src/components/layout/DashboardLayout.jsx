import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Bell, Menu, X, LayoutDashboard,
  User as UserIcon, LogOut,
} from 'lucide-react'

import Logo from '../common/logo'
import ParticleField from '../Particlefield'
import UserDropdown from './UserDropdown'
import BottomNav from './BottomNav'

export default function DashboardLayout({ children, activePage = 'dashboard', particleCount = 30 }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const storedUser = localStorage.getItem('fintime_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      navigate('/login')
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('fintime_token')
    localStorage.removeItem('fintime_user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#020b18] text-white font-['Sora'] overflow-x-hidden">
      <ParticleField count={particleCount} />

      {/* Top Navigation Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-3"
        style={{
          height: '70px',
          background: 'rgba(2,11,24,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,245,255,0.08)',
        }}
      >
        <div className="flex items-center justify-between h-full">
          <Logo />

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              {activePage !== 'dashboard' && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-cyan-400 transition-all"
                >
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </button>
              )}

              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-all">
                <Bell size={18} className="text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020b18]"></span>
              </button>

              <UserDropdown user={user} onLogout={handleLogout} />
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,245,255,0.1)' }}
            >
              {mobileMenuOpen ? (
                <X size={20} style={{ color: '#00f5ff' }} />
              ) : (
                <Menu size={20} style={{ color: '#00f5ff' }} />
              )}
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 rounded-xl overflow-hidden"
              style={{
                background: '#061528',
                border: '1px solid rgba(0,245,255,0.15)',
              }}
            >
              <div className="p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activePage === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <LayoutDashboard size={18} />
                  <span className="font-medium">Dashboard</span>
                </button>
                <button
                  onClick={() => { navigate('/profile'); setMobileMenuOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activePage === 'profile' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5'}`}
                >
                  <UserIcon size={18} />
                  <span className="font-medium">Profil Saya</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Keluar</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page Content */}
      {typeof children === 'function' ? children({ user, handleLogout }) : children}

      {/* Mobile Bottom Nav */}
      <BottomNav activePage={activePage} onLogout={handleLogout} />
    </div>
  )
}
