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
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useToast } from '../context/ToastContext'
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

export default function ReportsPage() {
  const { success, error: showError } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Filter states
  const [startDate, setStartDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 1)
    return d.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

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
        start_date: startDate,
        end_date: endDate,
      }
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (selectedType !== 'all') params.type = selectedType

      // Fetch transactions
      const transRes = await api.get(`/transactions/${userId}`, { params })
      const transData = transRes.data?.data || transRes.data || []

      // Calculate summary
      const income = transData
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      const expense = transData
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0)

      setTransactions(transData)
      setSummary({
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
        transactionCount: transData.length,
      })

      // Category breakdown
      const categoryMap = {}
      transData
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
          const cat = t.categoryLabel || 'lainnya'
          categoryMap[cat] = (categoryMap[cat] || 0) + (t.amount || 0)
        })
      setCategoryBreakdown(
        Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
      )

      // Monthly trend
      const monthMap = {}
      transData.forEach((t) => {
        const month = new Date(t.date || t.createdAt).toLocaleDateString('id-ID', { month: 'short' })
        if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 }
        if (t.type === 'income') monthMap[month].income += t.amount || 0
        if (t.type === 'expense') monthMap[month].expense += t.amount || 0
      })
      setMonthlyTrend(Object.values(monthMap))
    } catch (err) {
      console.error('Failed to fetch reports:', err)
      showError('Gagal memuat data laporan')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (format) => {
    try {
      setExporting(true)
      const params = { start_date: startDate, end_date: endDate }
      if (selectedCategory !== 'all') params.category = selectedCategory

      if (format === 'csv') {
        const response = await api.get(`/reports/${user?.id}/export/csv`, {
          params,
          responseType: 'blob',
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `fintime-report-${startDate}-${endDate}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        success('Laporan berhasil di-export sebagai CSV')
      } else {
        const response = await api.get(`/reports/${user?.id}/export/pdf`, {
          params,
          responseType: 'blob',
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `fintime-report-${startDate}-${endDate}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        success('Laporan berhasil di-export sebagai PDF')
      }
    } catch (err) {
      console.error('Export failed:', err)
      // Fallback: generate CSV locally
      if (format === 'csv') {
        generateLocalCSV()
      } else {
        showError('Gagal mengexport laporan')
      }
    } finally {
      setExporting(false)
    }
  }

  const generateLocalCSV = () => {
    const headers = ['Tanggal', 'Deskripsi', 'Kategori', 'Tipe', 'Jumlah']
    const rows = transactions.map((t) => [
      new Date(t.date || t.createdAt).toLocaleDateString('id-ID'),
      t.description,
      t.categoryLabel || 'lainnya',
      t.type,
      t.amount,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
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
        <main className="pt-24 px-4 sm:px-6 lg:px-8 relative z-10 pb-24">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 grad-text">
                Laporan Keuangan
              </h1>
              <p className="text-gray-400">
                Analisis dan laporan transaksi keuangan Anda
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                style={{
                  background: 'rgba(0,245,255,0.1)',
                  border: '1px solid rgba(0,245,255,0.2)',
                  color: '#00f5ff',
                }}
              >
                <Download size={16} />
                Export CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleExport('pdf')}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #0096c7)',
                  color: '#020b18',
                }}
              >
                <FileText size={16} />
                Export PDF
              </motion.button>
            </div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl p-6"
            style={{
              background: 'rgba(6,21,40,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar size={18} style={{ color: '#00f5ff' }} />
                <span className="text-sm font-medium" style={{ color: '#7aa6c2' }}>
                  Tanggal:
                </span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 rounded-xl outline-none"
                style={{
                  background: '#02111f',
                  border: '1px solid rgba(0,245,255,0.15)',
                  color: 'white',
                }}
              />
              <span style={{ color: '#7aa6c2' }}>s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 rounded-xl outline-none"
                style={{
                  background: '#02111f',
                  border: '1px solid rgba(0,245,255,0.15)',
                  color: 'white',
                }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-xl outline-none"
                style={{
                  background: '#02111f',
                  border: '1px solid rgba(0,245,255,0.15)',
                  color: 'white',
                }}
              >
                <option value="all">Semua Kategori</option>
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-xl outline-none"
                style={{
                  background: '#02111f',
                  border: '1px solid rgba(0,245,255,0.15)',
                  color: 'white',
                }}
              >
                <option value="all">Semua Tipe</option>
                <option value="income">Pendapatan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.1)' }}
                >
                  <TrendingUp size={20} style={{ color: '#22c55e' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#7aa6c2' }}>
                  Total Pendapatan
                </span>
              </div>
              <p className="text-xl font-bold text-green-400">
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(248,113,113,0.1)' }}
                >
                  <TrendingDown size={20} style={{ color: '#f87171' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#7aa6c2' }}>
                  Total Pengeluaran
                </span>
              </div>
              <p className="text-xl font-bold text-red-400">
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(0,245,255,0.1)' }}
                >
                  <Wallet size={20} style={{ color: '#00f5ff' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#7aa6c2' }}>
                  Saldo Bersih
                </span>
              </div>
              <p
                className="text-xl font-bold"
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(168,85,247,0.1)' }}
                >
                  <FileText size={20} style={{ color: '#a855f7' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: '#7aa6c2' }}>
                  Total Transaksi
                </span>
              </div>
              <p className="text-xl font-bold text-purple-400">
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
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <TrendingUp size={20} style={{ color: '#00f5ff' }} />
                Tren Bulanan
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,245,255,0.1)" />
                    <XAxis dataKey="month" stroke="#7aa6c2" fontSize={12} />
                    <YAxis stroke="#7aa6c2" fontSize={12} tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(1)}jt`} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(6,21,40,0.95)',
                        border: '1px solid rgba(0,245,255,0.2)',
                        borderRadius: '12px',
                        color: 'white',
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: '#22c55e', r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={{ fill: '#f87171', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm" style={{ color: '#7aa6c2' }}>Pendapatan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="text-sm" style={{ color: '#7aa6c2' }}>Pengeluaran</span>
                </div>
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(6,21,40,0.7)',
                border: '1px solid rgba(0,245,255,0.1)',
              }}
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                <PieChart size={20} style={{ color: '#00f5ff' }} />
                Breakdown Kategori
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
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
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: '#7aa6c2', fontSize: '12px' }}>{value}</span>
                      )}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Transaction Table */}
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
              className="px-6 py-4 border-b"
              style={{ borderColor: 'rgba(0,245,255,0.08)' }}
            >
              <h3 className="text-lg font-bold">Riwayat Transaksi</h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <p style={{ color: '#7aa6c2' }}>Memuat data...</p>
              </div>
            ) : paginatedTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold" style={{ color: '#7aa6c2' }}>
                  Tidak ada transaksi dalam periode ini
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#7aa6c2' }}>
                          Tanggal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#7aa6c2' }}>
                          Deskripsi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#7aa6c2' }}>
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#7aa6c2' }}>
                          Tipe
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: '#7aa6c2' }}>
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((trans, index) => (
                        <tr
                          key={trans.id || index}
                          className="transition-all hover:bg-white/5"
                          style={{ borderBottom: '1px solid rgba(0,245,255,0.04)' }}
                        >
                          <td className="px-6 py-4 text-sm" style={{ color: '#7aa6c2' }}>
                            {formatDate(trans.date || trans.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium" style={{ color: 'white' }}>
                            {trans.description}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className="px-2 py-1 rounded-lg text-xs font-medium"
                              style={{
                                background: 'rgba(0,245,255,0.08)',
                                color: '#00f5ff',
                              }}
                            >
                              {trans.categoryLabel || 'lainnya'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className="px-2 py-1 rounded-lg text-xs font-medium"
                              style={{
                                background:
                                  trans.type === 'income'
                                    ? 'rgba(34,197,94,0.1)'
                                    : 'rgba(248,113,113,0.1)',
                                color: trans.type === 'income' ? '#22c55e' : '#f87171',
                              }}
                            >
                              {trans.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-sm font-bold text-right"
                            style={{
                              color: trans.type === 'income' ? '#22c55e' : '#f87171',
                            }}
                          >
                            {trans.type === 'income' ? '+' : '-'}
                            {formatCurrency(trans.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ borderTop: '1px solid rgba(0,245,255,0.08)' }}
                  >
                    <span className="text-sm" style={{ color: '#7aa6c2' }}>
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                      {Math.min(currentPage * itemsPerPage, transactions.length)} dari{' '}
                      {transactions.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                        style={{
                          background: 'rgba(0,245,255,0.08)',
                          color: '#00f5ff',
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? ''
                              : 'opacity-50'
                          }`}
                          style={{
                            background:
                              currentPage === page
                                ? 'rgba(0,245,255,0.15)'
                                : 'rgba(0,245,255,0.08)',
                            color: currentPage === page ? '#00f5ff' : '#7aa6c2',
                          }}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-50"
                        style={{
                          background: 'rgba(0,245,255,0.08)',
                          color: '#00f5ff',
                        }}
                      >
                        <ChevronRight size={16} />
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