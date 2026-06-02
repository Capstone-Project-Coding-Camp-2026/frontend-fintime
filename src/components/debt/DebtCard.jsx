import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { AlertTriangle, Plus, Pencil, Trash2, Calendar, CreditCard, Wallet, CheckCircle, ChevronDown, History, Home, Car, Smartphone, Users, Package } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import api, { fetcher } from '../../lib/api'
import { useConfirm } from '../../context/ConfirmContext';

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

const DEBT_TYPES = [
  { id: 'kpr', label: 'KPR (Rumah)', icon: <Home size={18} /> },
  { id: 'vehicle', label: 'Kendaraan', icon: <Car size={18} /> },
  { id: 'pinjol', label: 'Pinjaman Online', icon: <Smartphone size={18} /> },
  { id: 'card', label: 'Kartu Kredit', icon: <CreditCard size={18} /> },
  { id: 'personal', label: 'Pinjaman Pribadi', icon: <Users size={18} /> },
  { id: 'other', label: 'Lainnya', icon: <Package size={18} /> },
]

export default function DebtCard({ onRefresh, refreshTrigger }) {
  const { success, error: showError, warning } = useToast()
  const { confirm } = useConfirm();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedHistoryDebt, setSelectedHistoryDebt] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [selectedDebt, setSelectedDebt] = useState(null)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)

  // Get user from localStorage
  const storedUser = localStorage.getItem('fintime_user')
  const user = storedUser ? JSON.parse(storedUser) : null

  // SWR fetching
  const { data: responseData, error, isLoading, mutate } = useSWR(user?.id ? `/debts/${user.id}` : null, fetcher)
  const debts = responseData?.success ? (responseData.data || []) : (responseData || [])

  // Refetch when global refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      mutate()
    }
  }, [refreshTrigger, mutate])

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'personal',
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    tenorMonths: '',
    startDate: '',
    dueDate: '',
    monthlyPayment: '',
    lender: '',
  })

  const [paymentAmount, setPaymentAmount] = useState('')

  // Auto calculate monthly payment
  useEffect(() => {
    const principal = parseFloat(formData.totalAmount)
    const rate = parseFloat(formData.interestRate) || 0
    const months = parseInt(formData.tenorMonths)

    if (principal && months > 0) {
      const totalInterest = principal * (rate / 100) * (months / 12)
      const totalPayment = principal + totalInterest
      const monthly = Math.round(totalPayment / months)
      setFormData(prev => ({ ...prev, monthlyPayment: monthly.toString() }))
    } else {
      setFormData(prev => ({ ...prev, monthlyPayment: '' }))
    }
  }, [formData.totalAmount, formData.interestRate, formData.tenorMonths])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const storedUser = localStorage.getItem('fintime_user')
      if (!storedUser) {
        setIsSubmitting(false)
        return
      }
      const user = JSON.parse(storedUser)

      const payload = {
        name: formData.name,
        type: formData.type,
        totalAmount: parseFloat(formData.totalAmount),
        remainingAmount: parseFloat(formData.remainingAmount) || parseFloat(formData.totalAmount),
        interestRate: parseFloat(formData.interestRate) || 0,
        tenorMonths: parseInt(formData.tenorMonths) || 12,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        monthlyPayment: parseFloat(formData.monthlyPayment) || 0,
        lender: formData.lender,
        userId: user.id,
      }

      if (editingId) {
        await api.put(`/debts/${editingId}`, payload)
        success('Hutang berhasil diupdate')
      } else {
        await api.post(`/debts/${user.id}`, payload)
        success('Hutang berhasil ditambahkan')
      }

      setShowForm(false)
      setEditingId(null)
      resetForm()
      mutate()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to save debt:', err)
      showError(err.response?.data?.message || 'Gagal menyimpan hutang')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!selectedDebt) return

    try {
      setIsSubmitting(true)
      await api.post(`/debts/${selectedDebt.id}/payments`, {
        amount: parseFloat(paymentAmount),
        date: new Date().toISOString(),
      })

      success('Pembayaran berhasil dicatat')
      setShowPayment(false)
      setSelectedDebt(null)
      setPaymentAmount('')
      mutate()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to record payment:', err)
      showError(err.response?.data?.message || 'Gagal mencatat pembayaran')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (debt) => {
    setFormData({
      name: debt.name || '',
      type: debt.type || 'personal',
      totalAmount: debt.totalAmount?.toString() || '',
      remainingAmount: debt.remainingAmount?.toString() || '',
      interestRate: debt.interestRate?.toString() || '',
      tenorMonths: debt.tenorMonths?.toString() || '',
      startDate: debt.startDate?.split('T')[0] || '',
      dueDate: debt.dueDate?.split('T')[0] || '',
      monthlyPayment: debt.monthlyPayment?.toString() || '',
      lender: debt.lender || '',
    })
    setEditingId(debt.id)
    setShowForm(true)
  }

  const handleDelete = async (debtId) => {
    if (!await confirm('Hapus hutang ini?')) return
    try {
      await api.delete(`/debts/${debtId}`)
      success('Hutang berhasil dihapus')
      mutate()
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Failed to delete debt:', err)
      showError(err.response?.data?.message || 'Gagal menghapus hutang')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'personal',
      totalAmount: '',
      remainingAmount: '',
      interestRate: '',
      tenorMonths: '',
      startDate: '',
      dueDate: '',
      monthlyPayment: '',
      lender: '',
    })
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate totals
  const totalDebt = debts.reduce((sum, d) => sum + (d.remainingAmount || d.totalAmount || 0), 0)
  const totalMonthly = debts.reduce((sum, d) => sum + (d.monthlyPayment || 0), 0)

  // Check for due soon (within 7 days)
  const dueSoonCount = debts.filter(d => {
    const days = getDaysUntilDue(d.dueDate)
    return days !== null && days <= 7 && days >= 0
  }).length

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(6,21,40,0.7)',
        border: '1px solid rgba(0,245,255,0.1)',
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(248,113,113,0.1)' }}
          >
            <CreditCard size={20} style={{ color: '#f87171' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'white' }}>
              Pelacakan Hutang
            </h2>
            <p className="text-sm" style={{ color: '#7aa6c2' }}>
              Kelola dan bayar hutang Anda
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {dueSoonCount > 0 && (
            <span
              className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold"
              style={{
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              <AlertTriangle size={12} />
              {dueSoonCount} Jatuh Tempo
            </span>
          )}
          <button
            onClick={() => {
              resetForm()
              setEditingId(null)
              setShowForm(true)
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
            style={{
              background: 'rgba(0,245,255,0.1)',
              border: '1px solid rgba(0,245,255,0.2)',
              color: '#00f5ff',
            }}
          >
            <Plus size={16} />
            Tambah
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div
        className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}
      >
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Total Hutang</span>
          <p className="text-base sm:text-lg font-bold truncate" style={{ color: '#f87171' }}>
            {formatCurrency(totalDebt)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Cicilan/Bulan</span>
          <p className="text-base sm:text-lg font-bold truncate" style={{ color: '#fbbf24' }}>
            {formatCurrency(totalMonthly)}
          </p>
        </div>
        <div>
          <span className="text-xs" style={{ color: '#7aa6c2' }}>Jumlah Hutang</span>
          <p className="text-base sm:text-lg font-bold" style={{ color: '#00f5ff' }}>
            {debts.length}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <p className="text-center py-4" style={{ color: '#7aa6c2' }}>Memuat...</p>
        ) : debts.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-semibold" style={{ color: '#7aa6c2' }}>
              Tidak ada hutang
            </p>
            <p className="text-sm mt-1" style={{ color: '#5a8aab' }}>
              Tambahkan hutang untuk mulai melacak
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {debts.map((debt) => {
              const remaining = debt.remainingAmount || debt.totalAmount || 0
              const original = debt.totalAmount || remaining
              const percent = original > 0 ? ((original - remaining) / original) * 100 : 0
              const daysUntil = getDaysUntilDue(debt.dueDate)
              const typeInfo = DEBT_TYPES.find(t => t.id === debt.type) || DEBT_TYPES[5]

              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-4"
                  style={{
                    background: 'rgba(0,245,255,0.03)',
                    border: '1px solid rgba(0,245,255,0.08)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0">{typeInfo.icon}</span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base truncate" style={{ color: 'white' }}>
                          {debt.name || 'Hutang'}
                        </h3>
                          <p className="text-[11px] sm:text-sm truncate" style={{ color: '#7aa6c2' }}>
                            {typeInfo.label} {debt.lender ? `• ${debt.lender}` : ''}
                          </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedHistoryDebt(debt)
                          setShowHistory(true)
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/5 hover:bg-blue-500/10 transition-all"
                        style={{ color: '#3b82f6', border: '1px solid rgba(59,130,246,0.1)' }}
                        title="Riwayat Pembayaran"
                      >
                        <History size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDebt(debt)
                          setPaymentAmount('')
                          setShowPayment(true)
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/5 hover:bg-green-500/10 transition-all"
                        style={{ color: '#22c55e', border: '1px solid rgba(34,197,94,0.1)' }}
                        title="Catat Pembayaran"
                      >
                        <Wallet size={14} />
                      </button>
                      <button
                        onClick={() => handleEdit(debt)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all"
                        style={{ color: '#7aa6c2', border: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/5 hover:bg-red-500/10 transition-all text-red-400"
                        style={{ border: '1px solid rgba(248,113,113,0.1)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] sm:text-sm mb-2">
                      <span style={{ color: '#7aa6c2' }}>
                        Terbayar: {percent.toFixed(0)}%
                      </span>
                      <span style={{ color: '#7aa6c2' }}>
                        Sisa: {formatCurrency(remaining)}
                      </span>
                    </div>
                    <div
                      className="h-1.5 sm:h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(0,245,255,0.1)' }}
                    >
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-sm">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {debt.monthlyPayment > 0 && (
                        <span style={{ color: '#7aa6c2' }}>
                          Cicilan: <span className="font-semibold" style={{ color: '#fbbf24' }}>
                            {formatCurrency(debt.monthlyPayment)}/bln
                          </span>
                        </span>
                      )}
                      {debt.interestRate > 0 && (
                        <span style={{ color: '#7aa6c2' }}>
                          Bunga: <span className="font-semibold" style={{ color: '#a855f7' }}>
                            {debt.interestRate}%
                          </span>
                        </span>
                      )}
                    </div>
                    {daysUntil !== null && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: daysUntil <= 7 ? 'rgba(251,191,36,0.1)' : 'rgba(0,245,255,0.08)',
                          color: daysUntil <= 7 ? '#fbbf24' : '#7aa6c2',
                        }}
                      >
                        <Calendar size={12} />
                        {daysUntil < 0
                          ? `Terlambat ${Math.abs(daysUntil)} hari`
                          : daysUntil === 0
                            ? 'Jatuh tempo hari ini'
                            : `Jatuh tempo ${daysUntil} hari lagi`
                        }
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full sm:max-w-lg rounded-2xl p-4 sm:p-6 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#7aa6c2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 pr-8">
              {editingId ? 'Edit Hutang' : 'Tambah Hutang Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                  Nama Hutang
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Contoh: Cicilan Motor"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Jenis
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none flex items-center justify-between transition-all text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>{DEBT_TYPES.find(t => t.id === formData.type)?.icon}</span>
                      <span className="truncate">{DEBT_TYPES.find(t => t.id === formData.type)?.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 transition-transform duration-300 ${showTypeDropdown ? 'rotate-180' : ''}`}
                      style={{ color: '#00f5ff' }}
                    />
                  </button>

                  {showTypeDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => setShowTypeDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-0 right-0 mt-2 z-[70] rounded-xl overflow-hidden border shadow-2xl"
                        style={{
                          background: 'rgba(6,21,40,0.98)',
                          backdropFilter: 'blur(10px)',
                          borderColor: 'rgba(0,245,255,0.2)',
                        }}
                      >
                        <div className="max-h-48 sm:max-h-60 overflow-y-auto custom-scrollbar">
                          {DEBT_TYPES.map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, type: type.id })
                                setShowTypeDropdown(false)
                              }}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-white/5 transition-all text-left text-sm sm:text-base"
                              style={{
                                color: formData.type === type.id ? '#00f5ff' : 'white',
                                background: formData.type === type.id ? 'rgba(0,245,255,0.05)' : 'transparent',
                              }}
                            >
                              <span className="text-lg sm:text-xl">{type.icon}</span>
                              <span className="font-medium">{type.label}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Lender / Pemberi Pinjaman
                  </label>
                  <input
                    type="text"
                    value={formData.lender}
                    onChange={(e) => setFormData({ ...formData, lender: e.target.value })}
                    placeholder="Contoh: BCA Finance"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Total Pinjaman (Rp)
                  </label>
                  <input
                    type="text"
                    value={formData.totalAmount ? new Intl.NumberFormat('id-ID').format(formData.totalAmount) : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, totalAmount: val })
                    }}
                    required
                    placeholder="25.000.000"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Sisa Hutang (Rp)
                  </label>
                  <input
                    type="text"
                    value={formData.remainingAmount ? new Intl.NumberFormat('id-ID').format(formData.remainingAmount) : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, remainingAmount: val })
                    }}
                    placeholder="15.000.000"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Bunga (%/tahun)
                  </label>
                  <input
                    type="number"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="12"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Tenor (bulan)
                  </label>
                  <input
                    type="number"
                    value={formData.tenorMonths}
                    onChange={(e) => setFormData({ ...formData, tenorMonths: e.target.value })}
                    min="1"
                    placeholder="36"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Cicilan/Bulan (Rp)
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={formData.monthlyPayment ? new Intl.NumberFormat('id-ID').format(formData.monthlyPayment) : ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setFormData({ ...formData, monthlyPayment: val })
                    }}
                    placeholder="Otomatis Dihitung"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base cursor-not-allowed opacity-70"
                    style={{
                      background: 'rgba(0,245,255,0.05)',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                    style={{
                      background: '#02111f',
                      border: '1px solid rgba(0,245,255,0.15)',
                      color: 'white',
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base"
                  style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: '#f87171',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isSubmitting ? 'rgba(0, 245, 255, 0.5)' : 'linear-gradient(135deg, #00f5ff, #0096c7)',
                    color: '#020b18',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <span className="block w-4 h-4 border-2 border-[#020b18] border-t-transparent rounded-full" />
                      </motion.div>
                      Menyimpan...
                    </>
                  ) : (
                    editingId ? 'Update' : 'Simpan'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedDebt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPayment(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full sm:max-w-md rounded-2xl p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#7aa6c2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-2 pr-8">Catat Pembayaran</h3>
            <p className="text-sm mb-4 sm:mb-6" style={{ color: '#7aa6c2' }}>
              {selectedDebt.name} - Sisa: {formatCurrency(selectedDebt.remainingAmount || 0)}
            </p>

            <form onSubmit={handlePayment} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2" style={{ color: '#7aa6c2' }}>
                  Jumlah Pembayaran (Rp)
                </label>
                <input
                  type="text"
                  value={paymentAmount ? new Intl.NumberFormat('id-ID').format(paymentAmount) : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    if (val === '' || parseInt(val) <= (selectedDebt?.remainingAmount || 0)) {
                      setPaymentAmount(val)
                    } else {
                      setPaymentAmount(selectedDebt?.remainingAmount?.toString() || val)
                    }
                  }}
                  required
                  placeholder="800.000"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl outline-none text-sm sm:text-base"
                  style={{
                    background: '#02111f',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'white',
                  }}
                />
              </div>

              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold"
                  style={{
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.2)',
                    color: '#f87171',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: isSubmitting ? 'rgba(34, 197, 94, 0.5)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      </motion.div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Bayar
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && selectedHistoryDebt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowHistory(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full sm:max-w-md rounded-2xl p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto custom-scrollbar"
            style={{
              background: 'rgba(6,21,40,0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
              style={{ color: '#7aa6c2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <h3 className="text-lg sm:text-xl font-bold mb-2 pr-8">Riwayat Pembayaran</h3>
            <p className="text-sm mb-4 sm:mb-6" style={{ color: '#7aa6c2' }}>
              {selectedHistoryDebt.name}
            </p>

            <div className="space-y-3">
              {(!selectedHistoryDebt.payments || selectedHistoryDebt.payments.length === 0) ? (
                <p className="text-center text-sm py-4" style={{ color: '#7aa6c2' }}>
                  Belum ada riwayat pembayaran.
                </p>
              ) : (
                selectedHistoryDebt.payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div>
                      <p className="text-sm font-semibold text-white">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs" style={{ color: '#7aa6c2' }}>{formatDate(payment.paidAt)}</p>
                    </div>
                    {payment.notes && <span className="text-xs" style={{ color: '#5a8aab' }}>{payment.notes}</span>}
                  </div>
                ))
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="w-full px-4 py-3 rounded-xl font-semibold text-sm sm:text-base"
                style={{
                  background: 'rgba(248,113,113,0.1)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  color: '#f87171',
                }}
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}



