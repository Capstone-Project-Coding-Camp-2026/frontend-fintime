import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
} from 'lucide-react'

import DashboardLayout from '../components/layout/DashboardLayout'
import AvatarConditionBanner from '../components/dashboard/AvatarConditionBanner'
import ScenarioForm from '../components/dashboard/ScenarioForm'
import AnalysisResult from '../components/dashboard/AnalysisResult'
import AddTransactionModal from '../components/dashboard/AddTransactionModal'
import AddAccountModal from '../components/dashboard/AddAccountModal'
import AccountCard from '../components/dashboard/AccountCard'
import TransactionCard from '../components/dashboard/TransactionCard'
import SmartLedger from '../components/dashboard/SmartLedger'

export default function DashboardPage() {
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

  return (
    <DashboardLayout activePage="dashboard">
      {({ user }) => (
        <>
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

            {/* Account & Transaction Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountCard
                  key={`account-${refreshKey}`}
                  userId={user?.id}
                  onDelete={handleRefresh}
                  onAddNew={() => setShowAddAccount(true)}
                />
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
        </>
      )}
    </DashboardLayout>
  )
}
