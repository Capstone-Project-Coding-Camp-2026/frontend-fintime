import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/common/Logo'
import {
  LogOut,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  Bell,
  Menu,
  X,
  ChevronDown,
  /*PlusCircle,*/ ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
} from 'lucide-react'

import ParticleField from '../components/Particlefield'
import AvatarConditionBanner from '../components/dashboard/AvatarConditionBanner'
import ScenarioForm from '../components/dashboard/ScenarioForm'
import AnalysisResult from '../components/dashboard/AnalysisResult'
import AddTransactionModal from '../components/dashboard/AddTransactionModal'
import AddAccountModal from '../components/dashboard/AddAccountModal'
import AccountCard from '../components/dashboard/AccountCard'
import TransactionCard from '../components/dashboard/TransactionCard'
import SmartLedger from '../components/dashboard/SmartLedger'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [defaultTransactionType, setDefaultTransactionType] =
    useState('expense')
  const [refreshKey, setRefreshKey] = useState(0)

  const [price, setPrice] = useState('')
  const [selectedOption, setSelectedOption] = useState('cash')
  const [installmentMonths, setInstallmentMonths] = useState('12')
  const [interestRate, setInterestRate] = useState('15')
  const [monthlyBudget, setMonthlyBudget] = useState('')

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [analysisData, setAnalysisData] = useState({
    goodPercent: 0,
    neutralPercent: 0,
    badPercent: 0,
    verdict: 'neutral',
    monthlyPayment: 0,
    remainingBudget: 0,
    totalPayment: 0,
  })

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

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setHasResult(false)

    setTimeout(() => {
      const p = parseFloat(price) || 0
      const b = parseFloat(monthlyBudget) || 0
      let total = p
      let monthly = p

      if (selectedOption === 'paylater') {
        const months = parseInt(installmentMonths) || 12
        const rate = (parseFloat(interestRate) || 15) / 100
        total = p + p * rate * (months / 12)
        monthly = total / months
      }

      const remaining = b - monthly

      let verdict = 'neutral'
      let good = 40,
        neutral = 40,
        bad = 20

      if (remaining > b * 0.5) {
        verdict = 'good'
        good = 85
        neutral = 10
        bad = 5
      } else if (remaining < 0) {
        verdict = 'bad'
        good = 5
        neutral = 15
        bad = 80
      }

      setAnalysisData({
        goodPercent: good,
        neutralPercent: neutral,
        badPercent: bad,
        verdict: verdict,
        monthlyPayment: Math.round(monthly),
        remainingBudget: Math.round(remaining),
        totalPayment: Math.round(total),
      })

      setIsAnalyzing(false)
      setHasResult(true)
    }, 2000)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (!user) return null

  return (
    <div className="relative min-h-screen min-h-[100dvh] bg-[#020b18] text-white font-['Sora'] overflow-x-hidden">
      <ParticleField count={30} />

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

          {/* Desktop: User Profile + Logout */}
          {!isMobile && (
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative hover:bg-white/10 transition-all">
                <Bell size={18} className="text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#020b18]"></span>
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all"
                  style={{
                    background: 'rgba(0,245,255,0.05)',
                    border: '1px solid rgba(0,245,255,0.15)',
                  }}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold">
                    {user.fullName?.charAt(0)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-[10px] text-gray-500">
                      {user.jobType ? user.jobType.charAt(0).toUpperCase() + user.jobType.slice(1).replace(/_/g, ' ') : user.occupation || 'Investor'}
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    style={{ color: 'var(--text-dim)' }}
                    className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden"
                      style={{
                        background: '#061528',
                        border: '1px solid rgba(0,245,255,0.15)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            navigate('/profile')
                            setProfileDropdownOpen(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-cyan-400 transition-all"
                        >
                          <UserIcon size={18} />
                          <span className="font-medium">Profil Saya</span>
                        </button>
                      </div>
                      <div className="border-t border-white/5 p-2">
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
              </div>
            </div>
          )}

          {/* Mobile: Menu Button */}
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

        {/* Mobile Menu */}
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
                  onClick={() => {
                    navigate('/profile')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-cyan-400 transition-all"
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

      {/* Main Content */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text">
              Overview Dashboard
            </h1>
            <p className="text-gray-400">
              Selamat datang kembali,{' '}
              <span className="text-cyan-400 font-semibold">
                {user.fullName}
              </span>
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
              Status Akun
            </p>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-bold text-gray-300">
                Terverifikasi
              </span>
            </div>
          </div>
        </div>

        {/* Banner Section */}
        <section className="mb-8">
          <AvatarConditionBanner
            userName={user.fullName}
            gender={user.gender || 'male'}
            balance={15400000}
            targetPension={500000000}
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDefaultTransactionType('expense')
                setShowAddTransaction(true)
              }}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                background: 'rgba(248, 113, 113, 0.08)',
                borderColor: 'rgba(248, 113, 113, 0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ArrowDownCircle size={20} style={{ color: '#f87171' }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Pengeluaran
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Tambah baru
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDefaultTransactionType('income')
                setShowAddTransaction(true)
              }}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                background: 'rgba(74, 222, 128, 0.08)',
                borderColor: 'rgba(74, 222, 128, 0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <ArrowUpCircle size={20} style={{ color: '#4ade80' }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Pendapatan
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Tambah baru
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                background: 'rgba(0, 245, 255, 0.05)',
                borderColor: 'rgba(0, 245, 255, 0.15)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Wallet size={20} style={{ color: '#00f5ff' }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Tambah Akun
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Hubungkan baru
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setDefaultTransactionType('expense')
                setShowAddTransaction(true)
              }}
              className="flex items-center gap-3 p-4 rounded-xl border transition-all"
              style={{
                background: 'rgba(168, 85, 247, 0.08)',
                borderColor: 'rgba(168, 85, 247, 0.2)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <CreditCard size={20} style={{ color: '#a855f7' }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Quick Transaksi
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Catat cepat
                </p>
              </div>
            </motion.button>
          </div>
        </section>

        {/* Account & Transaction Section - SEPARATE CARDS */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Card */}
            <AccountCard
              key={`account-${refreshKey}`}
              userId={user?.id}
              onDelete={handleRefresh}
              onAddNew={() => setShowAddAccount(true)}
            />

            {/* Transaction Card */}
            <TransactionCard
              key={`transaction-${refreshKey}`}
              userId={user?.id}
              onAddNew={() => {
                setDefaultTransactionType('expense')
                setShowAddTransaction(true)
              }}
            />
          </div>
        </section>

        {/* Analysis Section */}
        <section className="mb-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
          <ScenarioForm
            price={price}
            setPrice={setPrice}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            installmentMonths={installmentMonths}
            setInstallmentMonths={setInstallmentMonths}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />

          <AnalysisResult
            {...analysisData}
            price={parseFloat(price) || 0}
            selectedOption={selectedOption}
            hasResult={hasResult}
          />
        </div>
        </section>

        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SmartLedger />
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#061528]/90 backdrop-blur-xl border-t border-white/5 p-3 flex justify-around items-center md:hidden z-50">
        <button className="flex flex-col items-center gap-1 text-cyan-400">
          <LayoutDashboard size={22} />
          <span className="text-[10px] font-bold">Dash</span>
        </button>
        <button
          onClick={() => navigate('/profile')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <UserIcon size={22} />
          <span className="text-[10px]">Profil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <Settings size={22} />
          <span className="text-[10px]">Set</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-red-400"
        >
          <LogOut size={22} />
          <span className="text-[10px]">Keluar</span>
        </button>
      </nav>

      {/* Modals */}
      <AddTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSuccess={handleRefresh}
        defaultType={defaultTransactionType}
        userId={user?.id}
      />

      <AddAccountModal
        isOpen={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        onSuccess={handleRefresh}
        userId={user?.id}
      />
    </div>
  )
}
