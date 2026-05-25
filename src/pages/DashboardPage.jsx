import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CreditCard,
} from 'lucide-react'

import api from '../lib/api'
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

  // Real-time backend states
  const [totalBalance, setTotalBalance] = useState(0)
  const [projectedWealth, setProjectedWealth] = useState(0)
  const [pensionSurvivalYears, setPensionSurvivalYears] = useState(0)
  const [avatarCondition, setAvatarCondition] = useState('normal')
  const [monthlyIncome, setMonthlyIncome] = useState(5000000)
  const [monthlyExpense, setMonthlyExpense] = useState(3500000)

  // What-If Form States
  const [price, setPrice] = useState('')
  const [selectedOption, setSelectedOption] = useState('cash')
  const [installmentMonths, setInstallmentMonths] = useState('12')
  const [interestRate, setInterestRate] = useState('2')
  const [monthlyBudget, setMonthlyBudget] = useState('')

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [analysisData, setAnalysisData] = useState({
    goodPercent: 0,
    neutralPercent: 0,
    badPercent: 0,
    verdict: 'neutral',
    monthlyPayment: 0,
    remainingBudget: 0,
    totalPayment: 0,
  })

  // 1. Fetch real-time data on mount and refresh
  useEffect(() => {
    const storedUser = localStorage.getItem('fintime_user')
    if (!storedUser) return
    const u = JSON.parse(storedUser)

    setMonthlyIncome(u.monthlyIncome || 5000000)

    // Fetch Linked Account Summary
    api.get(`/linked-accounts/${u.id}/summary`)
      .then(res => {
        if (res.data?.success) {
          setTotalBalance(res.data.data.totalBalance || 0)
        }
      })
      .catch(err => console.error('Failed to get account summary:', err))

    // Run dynamic Forecast to get latest avatar health condition and pension wealth metrics
    api.post('/ai/forecast', { userId: u.id })
      .then(res => {
        if (res.data && res.data.success) {
          const aiData = res.data.data || {};
          setProjectedWealth(aiData.projectedWealth || 0)
          setPensionSurvivalYears(aiData.pensionSurvivalYears || 0)
          setAvatarCondition(aiData.condition || 'normal')

          if (aiData.predictedExpenses && aiData.predictedExpenses.length > 0) {
            // Estimate average future monthly expenses from the prediction trend
            const avgExpense = aiData.predictedExpenses.reduce((sum, val) => sum + val, 0) / aiData.predictedExpenses.length
            setMonthlyExpense(Math.round(avgExpense))
          }
        }
      })
      .catch(err => console.error('Failed to run forecast:', err))
  }, [refreshKey])

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setHasResult(false)

    try {
      const storedUser = localStorage.getItem('fintime_user')
      const u = storedUser ? JSON.parse(storedUser) : null

      const itemPriceVal = parseFloat(price) || 0

      const payload = {
        user_profile: {
          age: u?.age || 22,
          total_income: monthlyIncome,
          monthly_expenses: monthlyExpense,
          current_savings: totalBalance,

          has_emergency_fund: totalBalance >= monthlyExpense * 3 ? 1 : 0,

          emergency_fund_months:
            monthlyExpense > 0
              ? Number((totalBalance / monthlyExpense).toFixed(1))
              : 0,

          has_kpr: 0,
          has_vehicle_credit: 0,
          pinjol_active: 0,
          total_debt: 0,

          credit_card_utilization: 0.2,

          financial_literacy_score: 70,

          employment_type: "full_time",

          city_tier: "tier_2",

          paylater_usage_history:
            selectedOption === "paylater"
              ? "medium"
              : "low",

          impulse_spending_tendency: "medium",

          savings_rate:
            monthlyIncome > 0
              ? Number(
                (
                  (monthlyIncome - monthlyExpense) /
                  monthlyIncome
                ).toFixed(2)
              )
              : 0
        },

        simulation: {
          item_price: itemPriceVal,

          available_cash: totalBalance,

          paylater_interest_rate:
            selectedOption === "paylater"
              ? parseFloat(interestRate) / 100
              : 0,

          paylater_tenor_months:
            selectedOption === "paylater"
              ? parseInt(installmentMonths)
              : 1
        }
      }
      const response = await api.post('/ai/whatif', payload)

      if (response.data && response.data.success) {
        const data = response.data.data || {}
        const conf = data.confidence || 0.8

        // Map backend decision results back to graphical percentages
        let good = 40, neutral = 40, bad = 20
        let verdict = 'neutral' // default

        if (data.recommendation === 'just_buy') {
          verdict = 'good'
          good = Math.round(conf * 100)
          neutral = Math.round((1 - conf) * 60)
          bad = Math.round((1 - conf) * 40)
        } else if (data.recommendation === 'dont_buy') {
          verdict = 'bad'
          bad = Math.round(conf * 100)
          neutral = Math.round((1 - conf) * 60)
          good = Math.round((1 - conf) * 40)
        } else {
          verdict = 'neutral'
          neutral = Math.round(conf * 100)
          good = Math.round((1 - conf) * 50)
          bad = Math.round((1 - conf) * 50)
        }

        // Calculate payment metrics
        const monthlyPay = selectedOption === 'paylater'
          ? (itemPriceVal / parseInt(installmentMonths)) * (1 + (parseFloat(interestRate) / 100))
          : itemPriceVal

        const totalPay = selectedOption === 'paylater'
          ? monthlyPay * parseInt(installmentMonths)
          : itemPriceVal

        setAnalysisData({
          goodPercent: good,
          neutralPercent: neutral,
          badPercent: bad,
          verdict: verdict,
          monthlyPayment: Math.round(monthlyPay),
          remainingBudget: Math.round(data.cashflow_after_purchase),
          totalPayment: Math.round(totalPay),
        })

        setHasResult(true)
        setErrorMsg('')
      }
    } catch (err) {
      console.error('Failed to run what-if simulation:', err)
      const msg = err?.response?.data?.detail?.map(d => d.msg).join('; ') || err.message || 'Unexpected error'
      setErrorMsg(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <DashboardLayout activePage="dashboard" particleCount={30}>
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
                    {user?.fullName}
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
                userName={user?.fullName}
                gender={user?.gender || 'male'}
                balance={totalBalance}
                projectedWealth={projectedWealth}
                pensionSurvivalYears={pensionSurvivalYears}
                condition={avatarCondition}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                targetPension={user?.monthlyIncome ? user.monthlyIncome * 12 * 25 : 1500000000}
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
                {errorMsg && (
                  <p className="text-sm text-red-500 mt-2" style={{ color: 'var(--error-red)' }}>
                    {errorMsg}
                  </p>
                )}
                <AnalysisResult
                  {...analysisData}
                  price={parseFloat(price) || 0}
                  selectedOption={selectedOption}
                  hasResult={hasResult}
                />
              </div>
            </section>

            <section>
              <SmartLedger key={`ledger-${refreshKey}`} onRelabel={handleRefresh} />
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
