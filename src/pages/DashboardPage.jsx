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
import BudgetCard from '../components/budget/BudgetCard'
import DebtCard from '../components/debt/DebtCard'
import GoalCard from '../components/goal/GoalCard'
import FinancialLearning from '../components/dashboard/FinancialLearning'
import { useLanguage } from '../context/LanguageContext'

export default function DashboardPage() {
  const { t } = useLanguage()
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
  const [installmentMonths, setInstallmentMonths] = useState('')
  const [interestRate, setInterestRate] = useState('')

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
    if (!storedUser || storedUser === 'undefined') return

    let u
    try {
      u = JSON.parse(storedUser)
    } catch (e) {
      console.error('Failed to parse user data in dashboard:', e)
      return
    }

    setMonthlyIncome(u.monthlyIncome || 5000000)

    // 1. Fetch Instant Avatar State from DB (Cached)
    api
      .get('/ai/avatar-state')
      .then((res) => {
        if (res.data?.success && res.data.data) {
          const aiData = res.data.data
          setProjectedWealth(aiData.projectedWealth || 0)
          setPensionSurvivalYears(aiData.pensionSurvivalYears || 0)
          setAvatarCondition(aiData.condition || 'normal')

          if (
            aiData.predictedExpenseTrend &&
            Array.isArray(aiData.predictedExpenseTrend)
          ) {
            const avgExpense =
              aiData.predictedExpenseTrend.reduce((sum, val) => sum + val, 0) /
              aiData.predictedExpenseTrend.length
            setMonthlyExpense(Math.round(avgExpense))
          }
        }
      })
      .catch((err) => console.error('Failed to get cached avatar state:', err))

    // 2. Fetch Linked Account Summary
    api
      .get(`/linked-accounts/${u.id}/summary`)
      .then((res) => {
        if (res.data?.success) {
          setTotalBalance(res.data.data?.totalBalance || 0)
        }
      })
      .catch((err) => console.error('Failed to get account summary:', err))
  }, [refreshKey])

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!price || isAnalyzing) return

    setIsAnalyzing(true)
    setErrorMsg('')
    setHasResult(false)

    try {
      const payload = {
        itemPrice: parseFloat(price) || 0,
        selectedOption,
        installmentMonths: parseInt(installmentMonths) || 1,
        interestRate: parseFloat(interestRate) || 0,
      }

      const res = await api.post('/ai/whatif', payload)
      if (res.data?.success) {
        setAnalysisData(res.data.data)
        setHasResult(true)
      }
    } catch (err) {
      console.error('Failed to run what-if simulation:', err)
      const msg =
        err?.response?.data?.detail?.map((d) => d.msg).join('; ') ||
        err.message ||
        'Unexpected error'
      setErrorMsg(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <DashboardLayout
      activePage="dashboard"
      particleCount={30}
    >
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
                  {t('dash_welcome')},{' '}
                  <span className="text-cyan-400 font-semibold">
                    {user?.fullName}
                  </span>
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest font-medium mb-1">
                  {t('dash_status_account')}
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm font-bold text-gray-300">
                    {t('dash_status_verified')}
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
                targetPension={
                  user?.monthlyIncome
                    ? user.monthlyIncome * 12 * 25
                    : 1500000000
                }
              />
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* <motion.button
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
                      {t('dash_action_expense')}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('dash_action_add_new')}
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
                      {t('dash_action_income')}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('dash_action_add_new')}
                    </p>
                  </div>
                </motion.button> */}

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
                      {t('dash_action_add_account')}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('dash_action_connect_new')}
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
                      {t('dash_action_quick_tx')}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('dash_action_record_fast')}
                    </p>
                  </div>
                </motion.button>
              </div>
            </section>

            {/* Account & Transaction Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountCard
                  refreshTrigger={refreshKey}
                  userId={user?.id}
                  onDelete={handleRefresh}
                  onAddNew={() => setShowAddAccount(true)}
                />
                <TransactionCard
                  refreshTrigger={refreshKey}
                  userId={user?.id}
                  onAddNew={() => {
                    setDefaultTransactionType('expense')
                    setShowAddTransaction(true)
                  }}
                  onRefresh={handleRefresh}
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
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
                  {errorMsg && (
                    <p
                      className="text-sm mt-4 text-center"
                      style={{ color: 'var(--error-red)' }}
                    >
                      {errorMsg}
                    </p>
                  )}
                  {(() => {
                    const rec = analysisData?.recommendation;
                    const verdict = rec === 'buy' ? 'good' : (rec === 'buy_careful' ? 'neutral' : (rec === 'dont_buy' ? 'bad' : 'neutral'));
                    const confidence = (analysisData?.confidence || 0) * 100;
                    
                    let goodPercent = analysisData?.good_percent ?? analysisData?.goodPercent ?? 0;
                    let neutralPercent = analysisData?.neutral_percent ?? analysisData?.neutralPercent ?? 0;
                    let badPercent = analysisData?.bad_percent ?? analysisData?.badPercent ?? 0;

                    // Fallback using confidence if backend doesn't provide explicit percentages
                    if (goodPercent === 0 && neutralPercent === 0 && badPercent === 0 && confidence > 0) {
                      if (verdict === 'good') {
                        goodPercent = confidence;
                        neutralPercent = (100 - confidence) / 2;
                        badPercent = (100 - confidence) / 2;
                      } else if (verdict === 'neutral') {
                        neutralPercent = confidence;
                        goodPercent = (100 - confidence) / 2;
                        badPercent = (100 - confidence) / 2;
                      } else {
                        badPercent = confidence;
                        goodPercent = (100 - confidence) / 2;
                        neutralPercent = (100 - confidence) / 2;
                      }
                    }

                    return (
                      <AnalysisResult
                        goodPercent={goodPercent}
                        neutralPercent={neutralPercent}
                        badPercent={badPercent}
                        verdict={verdict}
                        monthlyPayment={analysisData?.monthly_payment ?? analysisData?.monthlyPayment ?? 0}
                        totalPayment={analysisData?.total_payment ?? analysisData?.totalPayment ?? 0}
                        alternatives={analysisData?.alternatives ?? []}
                        price={parseFloat(price) || 0}
                        selectedOption={selectedOption}
                        hasResult={hasResult}
                      />
                    );
                  })()}
                </div>
              </section>

            {/* Budget Section */}
            <section className="mt-8">
              <BudgetCard onRefresh={handleRefresh} refreshTrigger={refreshKey} />
            </section>

            {/* Debt Section */}
            <section className="mt-8">
              <DebtCard onRefresh={handleRefresh} refreshTrigger={refreshKey} />
            </section>

            {/* Goal Section */}
            <section className="mt-8">
              <GoalCard onRefresh={handleRefresh} refreshTrigger={refreshKey} />
            </section>

            {/* Financial Learning Section */}
            <section className="mt-8">
              <FinancialLearning condition={avatarCondition} />
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
