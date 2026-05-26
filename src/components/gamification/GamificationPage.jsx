import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Award, Star, Zap, Target, TrendingUp, Shield, Flame, Gift, ChevronRight } from 'lucide-react'
import DashboardLayout from '../layout/DashboardLayout'
import { useToast } from '../../context/ToastContext'
import api from '../../lib/api'

const ACHIEVEMENTS = [
  { id: 'first_transaction', name: 'First Step', desc: 'Catat transaksi pertama', icon: Star, color: '#fbbf24', condition: 'transactions >= 1' },
  { id: 'ten_transactions', name: 'Active Logger', desc: 'Catat 10 transaksi', icon: Trophy, color: '#22c55e', condition: 'transactions >= 10' },
  { id: 'fifty_transactions', name: 'Transaction Master', desc: 'Catat 50 transaksi', icon: Medal, color: '#a855f7', condition: 'transactions >= 50' },
  { id: 'first_goal', name: 'Dreamer', desc: 'Buat target tabungan pertama', icon: Target, color: '#06b6d4', condition: 'goals >= 1' },
  { id: 'goal_completed', name: 'Achiever', desc: 'Selesaikan target tabungan', icon: Award, color: '#ec4899', condition: 'goals_completed >= 1' },
  { id: 'budget_set', name: 'Planner', desc: 'Buat budget bulanan', icon: TrendingUp, color: '#f97316', condition: 'budgets >= 1' },
  { id: 'debt_tracked', name: 'Debt Manager', desc: 'Lacak hutang pertama', icon: Shield, color: '#00f5ff', condition: 'debts >= 1' },
  { id: 'streak_7', name: 'Consistent', desc: 'Login 7 hari berturut-turut', icon: Flame, color: '#f87171', condition: 'streak >= 7' },
  { id: 'streak_30', name: 'Dedicated', desc: 'Login 30 hari berturut-turut', icon: Zap, color: '#fbbf24', condition: 'streak >= 30' },
  { id: 'investment_added', name: 'Investor', desc: 'Tambahkan investasi', icon: Gift, color: '#22c55e', condition: 'investments >= 1' },
]

export default function GamificationPage() {
  const { success } = useToast()
  const [unlocked, setUnlocked] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    transactions: 0,
    goals: 0,
    goalsCompleted: 0,
    budgets: 0,
    debts: 0,
    streak: 0,
    investments: 0,
  })

  useEffect(() => {
    loadGamificationData()
  }, [])

  const loadGamificationData = async () => {
    try {
      setLoading(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) return
      const user = JSON.parse(storedUser)

      // Load user stats from localStorage (simplified)
      const savedAchievements = JSON.parse(localStorage.getItem('fintime_achievements') || '[]')
      setUnlocked(savedAchievements)

      // Get stats from various sources
      const transactionsRes = await api.get(`/transactions/${user.id}`).catch(() => ({ data: [] }))
      const transactions = Array.isArray(transactionsRes.data) ? transactionsRes.data : (transactionsRes.data?.data || [])
      const goalsRes = await api.get(`/goals/${user.id}`).catch(() => ({ data: [] }))
      const goals = Array.isArray(goalsRes.data) ? goalsRes.data : (goalsRes.data?.data || [])
      const debtsRes = await api.get(`/debts/${user.id}`).catch(() => ({ data: [] }))
      const debts = Array.isArray(debtsRes.data) ? debtsRes.data : (debtsRes.data?.data || [])
      const budgetsRes = await api.get(`/budgets/${user.id}`).catch(() => ({ data: [] }))
      const budgets = Array.isArray(budgetsRes.data) ? budgetsRes.data : (budgetsRes.data?.data || [])
      const investmentsRes = await api.get(`/investments/${user.id}`).catch(() => ({ data: [] }))
      const investments = Array.isArray(investmentsRes.data) ? investmentsRes.data : (investmentsRes.data?.data || [])

      const streak = parseInt(localStorage.getItem('fintime_streak') || '0')

      setStats({
        transactions: transactions.length,
        goals: goals.length,
        goalsCompleted: goals.filter(g => (g.currentAmount || 0) >= (g.targetAmount || 0)).length,
        budgets: budgets.length,
        debts: debts.length,
        streak: streak,
        investments: investments.length,
      })

      // Check for new achievements
      checkAchievements({
        transactions: transactions.length,
        goals: goals.length,
        goalsCompleted: goals.filter(g => (g.currentAmount || 0) >= (g.targetAmount || 0)).length,
        budgets: budgets.length,
        debts: debts.length,
        streak: streak,
        investments: investments.length,
      }, savedAchievements)
    } catch (err) {
      console.error('Failed to load gamification data:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkAchievements = (currentStats, currentUnlocked) => {
    const newUnlocked = []

    ACHIEVEMENTS.forEach((achievement) => {
      if (currentUnlocked.includes(achievement.id)) return

      let conditionMet = false
      switch (achievement.condition) {
        case 'transactions >= 1':
          conditionMet = currentStats.transactions >= 1
          break
        case 'transactions >= 10':
          conditionMet = currentStats.transactions >= 10
          break
        case 'transactions >= 50':
          conditionMet = currentStats.transactions >= 50
          break
        case 'goals >= 1':
          conditionMet = currentStats.goals >= 1
          break
        case 'goals_completed >= 1':
          conditionMet = currentStats.goalsCompleted >= 1
          break
        case 'budgets >= 1':
          conditionMet = currentStats.budgets >= 1
          break
        case 'debts >= 1':
          conditionMet = currentStats.debts >= 1
          break
        case 'streak >= 7':
          conditionMet = currentStats.streak >= 7
          break
        case 'streak >= 30':
          conditionMet = currentStats.streak >= 30
          break
        case 'investments >= 1':
          conditionMet = currentStats.investments >= 1
          break
      }

      if (conditionMet) {
        newUnlocked.push(achievement.id)
      }
    })

    if (newUnlocked.length > 0) {
      const allUnlocked = [...currentUnlocked, ...newUnlocked]
      localStorage.setItem('fintime_achievements', JSON.stringify(allUnlocked))
      setUnlocked(allUnlocked)

      newUnlocked.forEach((id, index) => {
        setTimeout(() => {
          const achievement = ACHIEVEMENTS.find(a => a.id === id)
          if (achievement) {
            success(`Achievement unlocked: ${achievement.name}!`)
          }
        }, index * 1000)
      })
    }
  }

  return (
    <DashboardLayout activePage="gamification" particleCount={20}>
      {({ user }) => (
        <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text">
              Achievement & Reward
            </h1>
            <p className="text-gray-400">
              Kumpulkan achievement dan raih reward menarik
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Transaksi', value: stats.transactions, icon: Star },
              { label: 'Target', value: stats.goals, icon: Target },
              { label: 'Budget', value: stats.budgets, icon: TrendingUp },
              { label: 'Hutang', value: stats.debts, icon: Shield },
              { label: 'Streak', value: `${stats.streak} hari`, icon: Flame },
              { label: 'Achievement', value: unlocked.length, icon: Trophy },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl p-4 text-center"
                style={{
                  background: 'rgba(6,21,40,0.7)',
                  border: '1px solid rgba(0,245,255,0.1)',
                }}
              >
                <stat.icon size={24} className="mx-auto mb-2" style={{ color: '#00f5ff' }} />
                <p className="text-2xl font-bold" style={{ color: 'white' }}>{stat.value}</p>
                <p className="text-xs" style={{ color: '#7aa6c2' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievement Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {ACHIEVEMENTS.map((achievement, index) => {
              const isUnlocked = unlocked.includes(achievement.id)
              const IconComponent = achievement.icon

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`relative rounded-2xl p-5 text-center transition-all ${
                    isUnlocked ? '' : 'opacity-40'
                  }`}
                  style={{
                    background: isUnlocked
                      ? `linear-gradient(135deg, ${achievement.color}15, ${achievement.color}05)`
                      : 'rgba(6,21,40,0.5)',
                    border: `2px solid ${isUnlocked ? achievement.color + '40' : 'rgba(0,245,255,0.1)'}`,
                    boxShadow: isUnlocked ? `0 0 30px ${achievement.color}20` : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      isUnlocked ? 'animate-pulse' : ''
                    }`}
                    style={{
                      background: isUnlocked ? `${achievement.color}20` : 'rgba(0,245,255,0.05)',
                    }}
                  >
                    <IconComponent size={32} style={{ color: isUnlocked ? achievement.color : '#7aa6c2' }} />
                  </div>

                  {/* Name */}
                  <h3 className="font-bold mb-1" style={{ color: isUnlocked ? 'white' : '#7aa6c2' }}>
                    {achievement.name}
                  </h3>
                  <p className="text-xs" style={{ color: '#5a8aab' }}>
                    {achievement.desc}
                  </p>

                  {/* Badge */}
                  {isUnlocked && (
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: achievement.color }}
                    >
                      <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Progress to Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 rounded-2xl p-6"
            style={{
              background: 'rgba(6,21,40,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'white' }}>
              Progress Achievement
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: '#7aa6c2' }}>{unlocked.length} / {ACHIEVEMENTS.length} Achievement</span>
              <span className="font-bold" style={{ color: '#00f5ff' }}>
                {Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden"
              style={{ background: 'rgba(0,245,255,0.1)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%`,
                  background: 'linear-gradient(90deg, #00f5ff, #a855f7)',
                }}
              />
            </div>
          </motion.div>
        </main>
      )}
    </DashboardLayout>
  )
}