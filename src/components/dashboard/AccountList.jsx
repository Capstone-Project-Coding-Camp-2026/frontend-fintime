import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, ChevronDown, ChevronUp, Trash2, ArrowUpRight, ArrowDownRight, Building2 } from 'lucide-react'
import { getProviderName, getProviderType } from '../../constants/providers'
import { useConfirm } from '../../context/ConfirmContext';

const CATEGORY_LABELS = {
  salary: 'Gaji', freelance: 'Freelance', investment: 'Investasi', gift: 'Hadiah', 'other-income': 'Lainnya',
  food: 'Makanan', transport: 'Transportasi', shopping: 'Belanja', bill: 'Tagihan',
  entertainment: 'Hiburan', health: 'Kesehatan', education: 'Pendidikan', 'other-expense': 'Lainnya',
}

export default function AccountList({ onDelete }) {
  const { confirm } = useConfirm();
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [activeTab, setActiveTab] = useState('accounts')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const savedAccounts = JSON.parse(localStorage.getItem('fintime_accounts') || '[]')
    const savedTransactions = JSON.parse(localStorage.getItem('fintime_transactions') || '[]')
    setAccounts(savedAccounts)
    setTransactions(savedTransactions)
  }

  const handleDelete = async (accountId) => {
    if (!await confirm('Yakin ingin menghapus akun ini?')) return
    const updated = accounts.filter(a => a.id !== accountId)
    localStorage.setItem('fintime_accounts', JSON.stringify(updated))
    setAccounts(updated)
    onDelete?.()
  }

  const formatCurrency = (num) => {
    return num.toLocaleString('id-ID')
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5)

  if (accounts.length === 0 && transactions.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('accounts')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={
            activeTab === 'accounts'
              ? { backgroundColor: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', border: '1px solid rgba(0, 245, 255, 0.3)' }
              : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', border: '1px solid rgba(0, 245, 255, 0.08)' }
          }
        >
          Akun Terhubung
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={
            activeTab === 'transactions'
              ? { backgroundColor: 'rgba(0, 245, 255, 0.1)', color: '#00f5ff', border: '1px solid rgba(0, 245, 255, 0.3)' }
              : { backgroundColor: 'rgba(0, 245, 255, 0.04)', color: 'var(--text-muted)', border: '1px solid rgba(0, 245, 255, 0.08)' }
          }
        >
          Transaksi Terbaru
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'accounts' && (
          <motion.div
            key="accounts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >

            {accounts.length > 0 && (
              <div className="mb-4 p-4 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(0, 245, 255, 0.08), rgba(0, 150, 199, 0.04))',
                border: '1px solid rgba(0, 245, 255, 0.15)',
              }}>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Total Saldo</p>
                <p className="text-2xl font-bold grad-text">Rp {formatCurrency(totalBalance)}</p>
              </div>
            )}

          
            <div className="space-y-3">
              {accounts.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--text-dim)' }}>
                  <Wallet size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Belum ada akun terhubung</p>
                </div>
              ) : (
                accounts.map((account) => {
                  const providerName = getProviderName(account.provider)
                  const providerType = getProviderType(account.provider)
                  return (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: 'rgba(0, 245, 255, 0.03)',
                        border: '1px solid rgba(0, 245, 255, 0.08)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: providerType === 'ewallet' ? 'rgba(0, 245, 255, 0.1)' : 'rgba(0, 150, 199, 0.1)',
                            border: `1px solid ${providerType === 'ewallet' ? 'rgba(0, 245, 255, 0.3)' : 'rgba(0, 150, 199, 0.3)'}`,
                          }}
                        >
                          {providerType === 'ewallet' ? (
                            <Wallet size={20} style={{ color: '#00f5ff' }} />
                          ) : (
                            <Building2 size={20} style={{ color: '#0096c7' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text)' }}>{account.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {providerName}
                            {account.accountNumber && ` • ${account.accountNumber}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold" style={{ color: '#00f5ff' }}>
                          Rp {formatCurrency(account.balance)}
                        </p>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                          style={{ color: '#f87171' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--text-dim)' }}>
                  <ArrowDownRight size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Belum ada transaksi</p>
                </div>
              ) : (
                <>
                  {displayedTransactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-4 rounded-xl"
                      style={{
                        background: 'rgba(0, 245, 255, 0.03)',
                        border: '1px solid rgba(0, 245, 255, 0.08)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background: tx.type === 'income'
                              ? 'rgba(74, 222, 128, 0.1)'
                              : 'rgba(248, 113, 113, 0.1)',
                          }}
                        >
                          {tx.type === 'income' ? (
                            <ArrowUpRight size={18} style={{ color: '#4ade80' }} />
                          ) : (
                            <ArrowDownRight size={18} style={{ color: '#f87171' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text)' }}>
                            {CATEGORY_LABELS[tx.category] || tx.category}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {tx.description || 'Tanpa deskripsi'} • {new Date(tx.date).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                      <p
                        className="font-semibold"
                        style={{ color: tx.type === 'income' ? '#4ade80' : '#f87171' }}
                      >
                        {tx.type === 'income' ? '+' : '-'}Rp {formatCurrency(tx.amount)}
                      </p>
                    </motion.div>
                  ))}

                  {transactions.length > 5 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        background: 'rgba(0, 245, 255, 0.04)',
                        border: '1px solid rgba(0, 245, 255, 0.1)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {showAll ? (
                        <>
                          <ChevronUp size={16} />
                          Tampilkan Lebih Sedikit
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          Lihat Semua ({transactions.length})
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}