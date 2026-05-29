import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, ChevronDown, ChevronUp, Trash2, Building2, Pencil } from 'lucide-react'
import api from '../../lib/api'
import { getProviderName, getProviderType } from '../../constants/providers'
import EditAccountModal from './EditAccountModal'

export default function AccountCard({ userId, onDelete, onAddNew }) {
  const [accounts, setAccounts] = useState([])
  const [totalBalance, setTotalBalance] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  useEffect(() => {
    if (userId) {
      loadAccounts()
    }
  }, [userId])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/linked-accounts/${userId}`)
      setAccounts(response.data.data || [])
      setTotalBalance(response.data.summary?.totalBalance || 0)
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (account) => {
    setSelectedAccount(account)
    setEditModalOpen(true)
  }

  const handleEditSuccess = (updatedAccount, wasDeleted) => {
    if (wasDeleted) {
      // Account was deleted
      setAccounts(prev => prev.filter(a => a.id !== selectedAccount.id))
      const newTotal = accounts
        .filter(a => a.id !== selectedAccount.id)
        .reduce((sum, acc) => sum + (acc.balance || 0), 0)
      setTotalBalance(newTotal)
      onDelete?.()
    } else if (updatedAccount) {
      // Account was updated
      setAccounts(prev => prev.map(a => a.id === updatedAccount.id ? updatedAccount : a))
      const newTotal = accounts
        .map(a => a.id === updatedAccount.id ? updatedAccount : a)
        .reduce((sum, acc) => sum + (acc.balance || 0), 0)
      setTotalBalance(newTotal)
    }
    setEditModalOpen(false)
    setSelectedAccount(null)
  }

  const formatCurrency = (num) => num.toLocaleString('id-ID')
  const displayedAccounts = showAll ? accounts : accounts.slice(0, 3)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 21, 40, 0.95), rgba(2, 11, 24, 0.95))',
            border: '1px solid rgba(0, 245, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="p-5 border-b space-y-4" style={{ borderColor: 'rgba(0, 245, 255, 0.08)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                <Wallet size={20} style={{ color: '#00f5ff' }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Akun Terhubung</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{accounts.length} akun terdaftar</p>
              </div>
            </div>
            <button
              onClick={onAddNew}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-cyan-500/10 flex items-center justify-center gap-2"
              style={{ background: 'rgba(0, 245, 255, 0.05)', border: '1px solid rgba(0, 245, 255, 0.15)', color: '#00f5ff' }}
            >
              + Tambah
            </button>
          </div>

          {accounts.length > 0 && (
            <div className="px-5 py-3" style={{ background: 'rgba(0, 245, 255, 0.03)' }}>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Total Saldo</p>
              <p className="text-xl font-bold grad-text">Rp {formatCurrency(totalBalance)}</p>
            </div>
          )}

          <div className="p-5 pt-3 space-y-3 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Memuat...</p>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8">
                <Wallet size={32} className="mx-auto mb-3" style={{ color: 'var(--text-dim)', opacity: 0.5 }} />
                <p className="text-sm mb-3" style={{ color: 'var(--text-dim)' }}>Belum ada akun terhubung</p>
                <button
                  onClick={onAddNew}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ background: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', border: '1px solid rgba(0, 245, 255, 0.2)' }}
                >
                  Hubungkan Akun
                </button>
              </div>
            ) : (
              <>
                {displayedAccounts.map((account) => {
                  const providerType = getProviderType(account.provider)
                  return (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl gap-3 sm:gap-0"
                      style={{
                        background: 'rgba(0, 245, 255, 0.03)',
                        border: '1px solid rgba(0, 245, 255, 0.08)',
                      }}
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div
                          className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center"
                          style={{
                            background: providerType === 'ewallet' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(0, 150, 199, 0.1)',
                            border: `1px solid ${providerType === 'ewallet' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(0, 150, 199, 0.3)'}`,
                          }}
                        >
                          {providerType === 'ewallet' ? (
                            <Wallet size={18} style={{ color: '#00f5ff' }} />
                          ) : (
                            <Building2 size={18} style={{ color: '#0096c7' }} />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{account.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                            {getProviderName(account.provider)}
                            {account.accountNumber && ` • ${account.accountNumber}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 pl-1 sm:pl-0 pt-2 border-t sm:border-0 sm:pt-0" style={{ borderColor: 'rgba(0,245,255,0.05)' }}>
                        <p className="font-semibold text-sm" style={{ color: '#00f5ff' }}>
                          Rp {formatCurrency(account.balance)}
                        </p>
                        <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(account)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-cyan-500/10"
                          style={{ color: '#00f5ff' }}
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (!confirm('Yakin ingin menghapus akun ini?')) return
                            api.delete(`/linked-accounts/${account.id}`).then(() => {
                              setAccounts(prev => prev.filter(a => a.id !== account.id))
                              const newTotal = accounts
                                .filter(a => a.id !== account.id)
                                .reduce((sum, acc) => sum + (acc.balance || 0), 0)
                              setTotalBalance(newTotal)
                              onDelete?.()
                            }).catch(err => {
                              console.error('Error deleting account:', err)
                              alert('Gagal menghapus akun')
                            })
                          }}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                          style={{ color: '#f87171' }}
                        >
                          <Trash2 size={12} />
                        </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {accounts.length > 3 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                      background: 'rgba(0, 245, 255, 0.02)',
                      border: '1px solid rgba(0, 245, 255, 0.08)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {showAll ? (
                      <><ChevronUp size={14} /> Tampilkan Lebih Sedikit</>
                    ) : (
                      <><ChevronDown size={14} /> Lihat Semua ({accounts.length})</>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Account Modal */}
      <EditAccountModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedAccount(null)
        }}
        onSuccess={handleEditSuccess}
        account={selectedAccount}
      />
    </>
  )
}
