import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ArrowUpCircle, ArrowDownCircle, Loader2, CheckCircle,
  Home, UtensilsCrossed, Car, Film, Pill, GraduationCap,
  ShoppingBag, FileText, Package,
  DollarSign, Briefcase, TrendingUp, Gift, Sparkles
} from 'lucide-react'
import api from '../../lib/api'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../lib/transactionApi'

const iconMap = {
  // Expense
  Home,
  UtensilsCrossed,
  Car,
  Film,
  Pill,
  GraduationCap,
  ShoppingBag,
  FileText,
  Package,
  // Income
  DollarSign,
  Briefcase,
  TrendingUp,
  Gift,
  Sparkles,
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess, defaultType = 'expense', userId }) {
  const [transactionType, setTransactionType] = useState(defaultType)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  useEffect(() => {
    if (isOpen) {
      setTransactionType(defaultType)
      setAmount('')
      setCategory('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      setShowSuccess(false)
    }
  }, [isOpen, defaultType])

  const formatCurrency = (value) => {
    const num = value.replace(/\D/g, '')
    return num ? parseInt(num).toLocaleString('id-ID') : ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || !category || !userId) return

    setIsSubmitting(true)

    try {
      const transactionData = {
        userId,
        dateTime: date,
        description,
        amount: parseInt(amount.replace(/\D/g, '')),
        transactionType: transactionType === 'income' ? 'credit' : 'debit',
        paymentMethod: 'tunai',
        categoryLabel: category
      }

      const response = await api.post('/transactions', transactionData)

      setIsSubmitting(false)
      setShowSuccess(true)

      setTimeout(() => {
        onSuccess(response.data.data)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error creating transaction:', error)
      setIsSubmitting(false)
      alert('Gagal menyimpan transaksi. Coba lagi.')
    }
  }

  const canSubmit = amount && parseInt(amount.replace(/,/g, '')) > 0 && category && userId

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        style={{ background: 'rgba(2, 11, 24, 0.9)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #061528 0%, #020b18 100%)',
            border: '1px solid rgba(0, 245, 255, 0.15)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div key="form">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(0, 245, 255, 0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{
                      background: transactionType === 'income' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)'
                    }}>
                      {transactionType === 'income' ? (
                        <ArrowUpCircle size={18} style={{ color: '#4ade80' }} />
                      ) : (
                        <ArrowDownCircle size={18} style={{ color: '#f87171' }} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Tambah Transaksi</h3>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Simpan ke database</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  {/* Transaction Type Toggle */}
                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Jenis Transaksi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setTransactionType('expense'); setCategory('') }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all"
                        style={
                          transactionType === 'expense'
                            ? { backgroundColor: 'rgba(248, 113, 113, 0.15)', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.4)' }
                            : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.12)' }
                        }
                      >
                        <ArrowDownCircle size={14} />
                        Pengeluaran
                      </button>
                      <button
                        type="button"
                        onClick={() => { setTransactionType('income'); setCategory('') }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all"
                        style={
                          transactionType === 'income'
                            ? { backgroundColor: 'rgba(74, 222, 128, 0.15)', color: '#4ade80', borderColor: 'rgba(74, 222, 128, 0.4)' }
                            : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.12)' }
                        }
                      >
                        <ArrowUpCircle size={14} />
                        Pendapatan
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Jumlah (Rp) <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--text-dim)' }}>
                        Rp
                      </span>
                      <input
                        type="text"
                        value={formatCurrency(amount)}
                        onChange={(e) => setAmount(e.target.value.replace(/,/g, ''))}
                        placeholder="0"
                        className="w-full px-8 py-2.5 rounded-lg text-sm font-semibold"
                        style={{
                          background: 'rgba(0, 245, 255, 0.04)',
                          border: '1px solid rgba(0, 245, 255, 0.12)',
                          color: 'var(--text)',
                          fontFamily: 'Sora, sans-serif',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Kategori <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 max-h-44 overflow-y-auto p-1 rounded-lg" style={{ background: 'rgba(0, 245, 255, 0.02)' }}>
                      {categories.map((cat) => {
                        const IconComponent = iconMap[cat.iconName]
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className="flex flex-col items-center gap-1 p-2.5 rounded-lg text-[10px] font-medium border transition-all"
                            style={
                              category === cat.id
                                ? { backgroundColor: 'rgba(0, 245, 255, 0.15)', color: '#00f5ff', borderColor: 'rgba(0, 245, 255, 0.4)' }
                                : { backgroundColor: 'rgba(0, 245, 255, 0.02)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.08)' }
                            }
                          >
                            {IconComponent && <IconComponent size={18} />}
                            <span>{cat.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Masukkan deskripsi transaksi..."
                      className="w-full px-3 py-2.5 rounded-lg text-xs"
                      style={{
                        background: 'rgba(0, 245, 255, 0.04)',
                        border: '1px solid rgba(0, 245, 255, 0.12)',
                        color: 'var(--text)',
                        fontFamily: 'Sora, sans-serif',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-xs"
                      style={{
                        background: 'rgba(0, 245, 255, 0.04)',
                        border: '1px solid rgba(0, 245, 255, 0.12)',
                        color: 'var(--text)',
                        fontFamily: 'Sora, sans-serif',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 btn-primary"
                    style={!canSubmit || isSubmitting ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Loader2 size={14} />
                        </motion.div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        {transactionType === 'income' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        {transactionType === 'income' ? 'Tambah Pendapatan' : 'Tambah Pengeluaran'}
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                    border: '2px solid rgba(34, 197, 94, 0.4)',
                  }}
                >
                  <CheckCircle size={32} style={{ color: '#22c55e' }} />
                </motion.div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>Berhasil!</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Transaksi tersimpan di database
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}