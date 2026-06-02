import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PieChart,
  X,
  RotateCcw,
  Check,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../context/ToastContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'
import { TRANSACTION_CATEGORIES } from '../components/dashboard/dashboardConstants'

const COLORS = ['#00f5ff', '#22c55e', '#f87171', '#fbbf24', '#a855f7', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6', '#f97316']

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const DATE_PRESETS = [
  { label: '7 Hari', days: 7 },
  { label: '30 Hari', days: 30 },
  { label: '3 Bulan', days: 90 },
  { label: '6 Bulan', days: 180 },
]

export default function ReportsPage() {
  const { t } = useLanguage()
  const { success, error: showError } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Helper for default dates
  const getDefaultStartDate = () => {
    const d = new Date()
    d.setMonth(d.getMonth() - 5) // Last 6 months inclusive
    return d.toISOString().split('T')[0]
  }
  const getDefaultEndDate = () => new Date().toISOString().split('T')[0]

  // Filter states - DEFAULT VALUES
  const DEFAULT_START = getDefaultStartDate()
  const DEFAULT_END = getDefaultEndDate()

  const [startDate, setStartDate] = useState(DEFAULT_START)
  const [endDate, setEndDate] = useState(DEFAULT_END)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  // Check individual filter status
  const isCategoryFiltered = selectedCategory !== 'all'
  const isTypeFiltered = selectedType !== 'all'
  const isDateFiltered = startDate !== DEFAULT_START || endDate !== DEFAULT_END
  const hasAnyFilter = isCategoryFiltered || isTypeFiltered || isDateFiltered
  const hasNonDateFilter = isCategoryFiltered || isTypeFiltered

  // Reset only category and type (keep date range)
  const handleResetNonDateFilters = () => {
    setSelectedCategory('all')
    setSelectedType('all')
    setCurrentPage(1)
  }

  // Reset all filters to defaults
  const handleResetAllFilters = () => {
    setStartDate(DEFAULT_START)
    setEndDate(DEFAULT_END)
    setSelectedCategory('all')
    setSelectedType('all')
    setCurrentPage(1)
  }

  // Quick preset date
  const handleDatePreset = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  // Data states
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    transactionCount: 0,
  })
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Export loading
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('fintime_user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      fetchData(parsed.id)
    }
  }, [])

  useEffect(() => {
    if (user) {
      fetchData(user.id)
    }
  }, [startDate, endDate, selectedCategory, selectedType])

  const fetchData = async (userId) => {
    try {
      setLoading(true)
      const params = {
        startDate,
        endDate,
      }
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (selectedType !== 'all') {
        params.type = selectedType === 'income' ? 'credit' : 'debit'
      }

      // Fetch transactions
      const transRes = await api.get(`/transactions/${userId}?limit=1000`, { params })
      const transData = transRes.data?.data || transRes.data || []

      // Calculate summary
      const income = transData
        .filter((t) => t.transactionType === 'credit')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      const expense = transData
        .filter((t) => t.transactionType === 'debit')
        .reduce((sum, t) => sum + (t.amount || 0), 0)

      setTransactions(transData)
      setSummary({
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        transactionCount: transData.length,
      })

      // Category breakdown (for expenses)
      const categoryMap = {}
      transData
        .filter((t) => t.transactionType === 'debit')
        .forEach((t) => {
          const cat = t.categoryLabel || 'lainnya'
          categoryMap[cat] = (categoryMap[cat] || 0) + (t.amount || 0)
        })
      setCategoryBreakdown(
        Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
      )

      // Monthly trend logic with sorting
      const trendData = []
      const monthGroups = {}
      
      // Process all months in range to avoid gaps
      transData.forEach(t => {
        const d = new Date(t.dateTime || t.date || t.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('id-ID', { month: 'short' })
        
        if (!monthGroups[key]) {
          monthGroups[key] = { key, month: label, income: 0, expense: 0 }
        }
        
        if (t.transactionType === 'credit') monthGroups[key].income += t.amount || 0
        if (t.transactionType === 'debit') monthGroups[key].expense += t.amount || 0
      })

      // Sort by key (YYYY-MM) and set to state
      const sortedTrend = Object.keys(monthGroups)
        .sort()
        .map(k => monthGroups[k])
      
      setMonthlyTrend(sortedTrend)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
      showError(err.response?.data?.message || 'Gagal memuat data laporan')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format) => {
    try {
      setExporting(true)
      
      if (format === 'csv') {
        generateLocalCSV()
      } else {
        // Karena backend belum mendukung export PDF secara native, 
        // kita gunakan print browser bawaan sebagai solusi cepat dan rapi.
        window.print()
        success('Silakan simpan halaman sebagai PDF melalui dialog cetak.')
      }
    } catch (err) {
      console.error('Export failed:', err)
      showError(err.response?.data?.message || 'Gagal mengexport laporan')
    } finally {
      setExporting(false)
    }
  }

  const generateLocalCSV = () => {
    const headers = ['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']
    const rows = transactions.map((t) => {
      // Escape description if it contains commas
      const desc = t.description ? `"${t.description.replace(/"/g, '""')}"` : '""'
      const date = new Date(t.dateTime || t.date || t.createdAt).toLocaleDateString('id-ID')
      const type = t.transactionType === 'credit' ? 'Pendapatan' : 'Pengeluaran'
      
      return [
        date,
        desc,
        t.categoryLabel || 'lainnya',
        type,
        t.amount,
      ]
    })
    
    // Add BOM for Excel UTF-8 compatibility
    const csvContent = '\uFEFF' + [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `fintime-report-${startDate}-${endDate}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    success('Laporan berhasil di-export sebagai CSV')
  }

  // Pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <DashboardLayout activePage="reports" particleCount={30}>
      {({ user: layoutUser }) => (
        <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24 print:pt-4 print:pb-4 print:bg-white print:text-black">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text print:text-black print:!bg-none print:!-webkit-text-fill-color-initial">
                {t('rep_title')}
              </h1>
              <p className="text-gray-400 print:text-gray-700">
                {t('rep_subtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto print:hidden">
              {/* Reset buttons based on active filters */}
              {hasAnyFilter && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleResetAllFilters}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border border-red-500/30 text-red-400 hover:bg-red-500/10 whitespace-nowrap"
                >
                  <RotateCcw size={16} />
                  Reset Filter
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: showFilters ? 'rgba(0,245,255,0.2)' : 'rgba(0,245,255,0.1)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: '#00f5ff',
                }}
              >
                <Filter size={16} />
                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: 'rgba(0,245,255,0.1)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: '#00f5ff',
                }}
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">CSV</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                  color: '#020b18',
                }}
              >
                <FileText size={16} />
                <span className="hidden sm:inline">Export PDF</span>
                <span className="sm:hidden">PDF</span>
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 rounded-2xl p-4 sm:p-6 transition-all print:hidden ${showFilters ? 'block' : 'hidden sm:block'}`}
            style={{
              background: 'rgba(6,21,40,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            {/* Quick Date Presets */}
            <div className="mb-4">
              <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: '#7aa6c2' }}>{t('rep_quick_select')}</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 7, label: t('rep_preset_7d') },
                  { id: 30, label: t('rep_preset_30d') },
                  { id: 90, label: t('rep_preset_3m') },
                  { id: 180, label: t('rep_preset_6m') },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleDatePreset(preset.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: 'rgba(0,245,255,0.05)',
                      border: '1px solid rgba(0,245,255,0.1)',
                      color: '#7aa6c2',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,245,255,0.15)'
                      e.currentTarget.style.color = '#00f5ff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,245,255,0.05)'
                      e.currentTarget.style.color = '#7aa6c2'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] uppercase tracking-wider block" style={{ color: '#7aa6c2' }}>{t('rep_start_date')}</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl outline-none text-sm"
                    style={{
                      background: '#02111f',
                      border: `1px solid ${isDateFiltered ? 'rgba(251,191,36,0.4)' : 'rgba(0,245,255,0.15)'}`,
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] uppercase tracking-wider block" style={{ color: '#7aa6c2' }}>{t('rep_end_date')}</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl outline-none text-sm"
                    style={{
                      background: '#02111f',
                      border: `1px solid ${isDateFiltered ? 'rgba(251,191,36,0.4)' : 'rgba(0,245,255,0.15)'}`,
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] uppercase tracking-wider block" style={{ color: '#7aa6c2' }}>{t('rep_category')}</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-2 rounded-xl outline-none text-sm cursor-pointer"
                    style={{
                      background: '#02111f',
                      border: `1px solid ${isCategoryFiltered ? 'rgba(0,245,255,0.5)' : 'rgba(0,245,255,0.15)'}`,
                      color: 'white',
                    }}
                  >
                    <option value="all" className="bg-[#02111f]">{t('rep_all_categories')}</option>
                    {TRANSACTION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#02111f]">{t(`cat_${cat}`) || cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-[10px] uppercase tracking-wider block" style={{ color: '#7aa6c2' }}>{t('rep_type')}</label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-2 rounded-xl outline-none text-sm cursor-pointer"
                    style={{
                      background: '#02111f',
                      border: `1px solid ${isTypeFiltered ? 'rgba(168,85,247,0.5)' : 'rgba(0,245,255,0.15)'}`,
                      color: 'white',
                    }}
                  >
                    <option value="all" className="bg-[#02111f]">{t('rep_all_types')}</option>
                    <option value="income" className="bg-[#02111f]">{t('rep_income')}</option>
                    <option value="expense" className="bg-[#02111f]">{t('rep_expense')}</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active filter summary */}
            {hasAnyFilter && (
              <div className="mt-4 pt-4 flex flex-wrap items-center gap-2" style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}>
                <span className="text-[10px] uppercase tracking-wider" style={{ color: '#7aa6c2' }}>{t('rep_active_filters')}:</span>
                {isDateFiltered && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    {t('rep_date')}
                    <button onClick={() => { setStartDate(DEFAULT_START); setEndDate(DEFAULT_END) }} className="ml-1 hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {isCategoryFiltered && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {t(`cat_${selectedCategory}`) || selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                )}
                {isTypeFiltered && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {selectedType === 'income' ? t('rep_income') : t('rep_expense')}
                    <button onClick={() => setSelectedType('all')} className="ml-1 hover:text-white">
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(34,197,94,0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.1)' }}
                >
                  <TrendingUp size={18} style={{ color: '#22c55e' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#7aa6c2' }}>
                  {t('rep_total_income')}
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-green-400">
                {formatCurrency(summary.totalIncome)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(248,113,113,0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(248,113,113,0.1)' }}
                >
                  <TrendingDown size={18} style={{ color: '#f87171' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#7aa6c2' }}>
                  {t('rep_total_expense')}
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-red-400">
                {formatCurrency(summary.totalExpense)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: `1px solid ${
                  summary.netBalance >= 0
                    ? 'rgba(0,245,255,0.2)'
                    : 'rgba(248,113,113,0.2)'
                }`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,245,255,0.1)' }}
                >
                  <Wallet size={18} style={{ color: '#00f5ff' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#7aa6c2' }}>
                  {t('rep_net_balance')}
                </span>
              </div>
              <p
                className="text-lg sm:text-xl font-bold"
                style={{
                  color: summary.netBalance >= 0 ? '#00f5ff' : '#f87171',
                }}
              >
                {formatCurrency(summary.netBalance)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(168,85,247,0.2)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(168,85,247,0.1)' }}
                >
                  <FileText size={18} style={{ color: '#a855f7' }} />
                </div>
                <span className="text-xs font-medium" style={{ color: '#7aa6c2' }}>
                  {t('rep_tx_count')}
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-purple-400">
                {summary.transactionCount}
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-4 sm:p-6"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-6 flex items-center gap-3">
                <TrendingUp size={20} style={{ color: '#00f5ff' }} />
                {t('rep_trend')}
              </h3>
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,245,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" stroke="#7aa6c2" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="#7aa6c2" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(v) => {
                        if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace('.0', '')}jt`
                        if (v >= 1000) return `${(v / 1000).toFixed(0)}rb`
                        return v
                      }} 
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(6,21,40,0.95)',
                        border: '1px solid rgba(0,245,255,0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorIncome)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#f87171"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorExpense)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] sm:text-xs" style={{ color: '#7aa6c2' }}>{t('rep_income')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-[10px] sm:text-xs" style={{ color: '#7aa6c2' }}>{t('rep_expense')}</span>
                </div>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl p-4 sm:p-6"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <h3 className="text-base sm:text-lg font-bold mb-6 flex items-center gap-3">
                <PieChart size={20} style={{ color: '#00f5ff' }} />
                {t('rep_breakdown')}
              </h3>
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <RechartsPie>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="80%"
                      fill="#8884d8"
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(6,21,40,0.95)',
                        border: '1px solid rgba(0,245,255,0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span className="text-[10px] sm:text-xs font-medium" style={{ color: '#7aa6c2' }}>{t(`cat_${value}`) || value}</span>
                      )}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Transaction Table / List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(6,21,40,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: 'rgba(0,245,255,0.08)' }}
            >
              <h3 className="text-lg font-bold">Riwayat Transaksi</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {transactions.length} Total
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p style={{ color: '#7aa6c2' }}>Memuat data transaksi...</p>
              </div>
            ) : paginatedTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-semibold" style={{ color: '#7aa6c2' }}>
                  Tidak ada transaksi dalam periode ini
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7aa6c2' }}>
                          Tanggal
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7aa6c2' }}>
                          Deskripsi
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7aa6c2' }}>
                          Kategori
                        </th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7aa6c2' }}>
                          Tipe
                        </th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7aa6c2' }}>
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((trans, index) => (
                        <tr
                          key={trans.id || index}
                          className="transition-all hover:bg-white/[0.02]"
                          style={{ borderBottom: '1px solid rgba(0,245,255,0.04)' }}
                        >
                          <td className="px-6 py-4 text-sm" style={{ color: '#7aa6c2' }}>
                            {formatDate(trans.dateTime || trans.date || trans.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium" style={{ color: 'white' }}>
                            {trans.description}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tight"
                              style={{
                                background: 'rgba(0,245,255,0.08)',
                                color: '#00f5ff',
                                border: '1px solid rgba(0,245,255,0.1)'
                              }}
                            >
                              {trans.categoryLabel || 'lainnya'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              {trans.transactionType === 'credit' ? 
                                <TrendingUp size={14} className="text-green-400" /> : 
                                <TrendingDown size={14} className="text-red-400" />
                              }
                              <span
                                className="text-xs font-semibold"
                                style={{
                                  color: trans.transactionType === 'credit' ? '#22c55e' : '#f87171',
                                }}
                              >
                                {trans.transactionType === 'credit' ? 'Masuk' : 'Keluar'}
                              </span>
                            </div>
                          </td>
                          <td
                            className="px-6 py-4 text-sm font-bold text-right"
                            style={{
                              color: trans.transactionType === 'credit' ? '#22c55e' : '#f87171',
                            }}
                          >
                            {trans.transactionType === 'credit' ? '+' : '-'}
                            {formatCurrency(trans.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden divide-y divide-white/[0.04]">
                  {paginatedTransactions.map((trans, index) => (
                    <div key={trans.id || index} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5" style={{ color: '#7aa6c2' }}>
                          {formatDate(trans.dateTime || trans.date || trans.createdAt)}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded ${
                            trans.transactionType === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {trans.transactionType === 'credit' ? 'Masuk' : 'Keluar'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-1">{trans.description || 'Tanpa Deskripsi'}</p>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10">
                          {trans.categoryLabel || 'lainnya'}
                        </span>
                      </div>
                      <div className="flex items-center justify-end">
                        <p className={`text-base font-bold ${trans.transactionType === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {trans.transactionType === 'credit' ? '+' : '-'} {formatCurrency(trans.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: '1px solid rgba(0,245,255,0.08)', background: 'rgba(0,0,0,0.1)' }}
                  >
                    <span className="text-xs font-medium" style={{ color: '#7aa6c2' }}>
                      <span className="text-white">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, transactions.length)}</span> dari <span className="text-white">{transactions.length}</span> Transaksi
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: 'rgba(0,245,255,0.08)',
                          border: '1px solid rgba(0,245,255,0.1)',
                          color: '#00f5ff',
                        }}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      
                      <div className="flex items-center gap-1.5 mx-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum = currentPage
                          if (currentPage <= 3) pageNum = i + 1
                          else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                          else pageNum = currentPage - 2 + i
                          
                          if (pageNum <= 0 || pageNum > totalPages) return null

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                                currentPage === pageNum ? 'shadow-[0_0_15px_rgba(0,245,255,0.3)]' : ''
                              }`}
                              style={{
                                background: currentPage === pageNum ? '#00f5ff' : 'rgba(0,245,255,0.05)',
                                border: `1px solid ${currentPage === pageNum ? '#00f5ff' : 'rgba(0,245,255,0.1)'}`,
                                color: currentPage === pageNum ? '#02111f' : '#7aa6c2',
                              }}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: 'rgba(0,245,255,0.08)',
                          border: '1px solid rgba(0,245,255,0.1)',
                          color: '#00f5ff',
                        }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </main>
      )}
    </DashboardLayout>
  )
}
