import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wallet, Loader2, CheckCircle, Building2 } from 'lucide-react'
import api from '../../lib/api'
import { PROVIDERS } from '../../constants/providers'

export default function AddAccountModal({ isOpen, onClose, onSuccess, userId }) {
  const [accountType, setAccountType] = useState('ewallet')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [balance, setBalance] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const providers = accountType === 'ewallet' ? PROVIDERS.ewallets : PROVIDERS.banks

  useEffect(() => {
    if (isOpen) {
      setAccountType('ewallet')
      setSelectedProvider('')
      setAccountName('')
      setAccountNumber('')
      setBalance('')
      setShowSuccess(false)
    }
  }, [isOpen])

  const formatCurrency = (value) => {
    const num = value.replace(/\D/g, '')
    return num ? parseInt(num).toLocaleString('id-ID') : ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProvider || !accountName || !userId) return

    setIsSubmitting(true)

    try {
      const accountData = {
        userId,
        type: accountType,
        provider: selectedProvider,
        name: accountName,
        accountNumber,
        balance: parseInt(balance.replace(/\D/g, '')) || 0
      }

      const response = await api.post('/linked-accounts', accountData)

      setIsSubmitting(false)
      setShowSuccess(true)

      setTimeout(() => {
        onSuccess(response.data.data)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error linking account:', error)
      setIsSubmitting(false)
      alert(error.response?.data?.message || 'Gagal menghubungkan akun. Coba lagi.')
    }
  }

  const canSubmit = selectedProvider && accountName && userId

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto"
        style={{ background: 'rgba(2, 11, 24, 0.9)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-2xl my-4"
          style={{
            background: 'linear-gradient(135deg, #061528 0%, #020b18 100%)',
            border: '1px solid rgba(0, 245, 255, 0.15)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div key="form">
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(0, 245, 255, 0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0, 245, 255, 0.1)' }}>
                      <Wallet size={18} style={{ color: '#00f5ff' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Tambah Akun</h3>
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
                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Jenis Akun
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => { setAccountType('ewallet'); setSelectedProvider('') }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all"
                        style={
                          accountType === 'ewallet'
                            ? { backgroundColor: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', borderColor: 'rgba(0, 245, 255, 0.3)' }
                            : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.12)' }
                        }
                      >
                        eWallet
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAccountType('bank'); setSelectedProvider('') }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all"
                        style={
                          accountType === 'bank'
                            ? { backgroundColor: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', borderColor: 'rgba(0, 245, 255, 0.3)' }
                            : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.12)' }
                        }
                      >
                        Bank
                      </button>
                    </div>
                  </div>


                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Provider <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-1 rounded-lg" style={{ background: 'rgba(0, 245, 255, 0.02)' }}>
                      {providers.map((provider) => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => setSelectedProvider(provider.id)}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium border transition-all"
                          style={
                            selectedProvider === provider.id
                              ? { backgroundColor: 'rgba(0, 245, 255, 0.15)', color: '#00f5ff', borderColor: 'rgba(0, 245, 255, 0.4)' }
                              : { backgroundColor: 'rgba(0, 245, 255, 0.02)', color: 'var(--text-muted)', borderColor: 'rgba(0, 245, 255, 0.08)' }
                          }
                        >
                          {accountType === 'bank' ? (
                            <Building2 size={16} />
                          ) : (
                            <Wallet size={16} />
                          )}
                          <span className="truncate w-full text-center">{provider.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Nama Akun <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Contoh: GoPay Utama"
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

                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Nomor Rekening / Telepon
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder={accountType === 'ewallet' ? '08xxxxxxxxxx' : '1234567890'}
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


                  <div>
                    <label className="text-[10px] mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Saldo Awal (Rp)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: 'var(--text-dim)' }}>
                        Rp
                      </span>
                      <input
                        type="text"
                        value={formatCurrency(balance)}
                        onChange={(e) => setBalance(e.target.value.replace(/,/g, ''))}
                        placeholder="0"
                        className="w-full px-8 py-2.5 rounded-lg text-xs"
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
                        <Wallet size={14} />
                        Hubungkan Akun
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
                  Akun tersimpan di database
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}