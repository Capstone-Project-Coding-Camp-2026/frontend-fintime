import { motion } from 'framer-motion'
import {
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export default function TransactionView({
  loading,
  showAll,
  setShowAll,
  transactionFilter,
  setTransactionFilter,
  displayedTransactions,
  filteredTransactions,
  totalIncome,
  totalExpense,
  balance,
  formatCurrency,
  formatDate,
  onAddNew,
  CATEGORY_LABELS,
  TRANSACTION_FILTERS,
}) {
  return (
    <motion.div
      key="transactions-view"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div
        className="grid grid-cols-3 divide-x"
        style={{
          background:
            'rgba(0, 245, 255, 0.03)',
          borderBottom:
            '1px solid rgba(0, 245, 255, 0.08)',
        }}
      >
        <div className="p-3 text-center">
          <p className="text-[10px] mb-1 text-gray-400">
            Pemasukan
          </p>

          <p className="font-semibold text-sm text-green-400">
            +Rp {formatCurrency(totalIncome)}
          </p>
        </div>

        <div className="p-3 text-center">
          <p className="text-[10px] mb-1 text-gray-400">
            Pengeluaran
          </p>

          <p className="font-semibold text-sm text-red-400">
            -Rp {formatCurrency(totalExpense)}
          </p>
        </div>

        <div className="p-3 text-center">
          <p className="text-[10px] mb-1 text-gray-400">
            Saldo
          </p>

          <p className="font-semibold text-sm text-cyan-400">
            Rp {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-3 overflow-x-auto">
        {TRANSACTION_FILTERS.map(({ key, label }) => {
          const active = transactionFilter === key

          return (
            <button
              key={key}
              onClick={() => setTransactionFilter(key)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={
                active
                  ? {
                      background:
                        'rgba(0,245,255,0.15)',
                      color: '#00f5ff',
                    }
                  : {
                      background:
                        'rgba(0,245,255,0.05)',
                      color: '#94a3b8',
                    }
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="p-5 pt-3 space-y-3 max-h-[350px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            Memuat...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <ArrowDownRight
              size={32}
              className="mx-auto mb-3 text-gray-500"
            />

            <button
              onClick={onAddNew}
              className="px-4 py-2 rounded-lg text-sm bg-cyan-500 text-black"
            >
              Catat Transaksi
            </button>
          </div>
        ) : (
          <>
            {displayedTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl gap-2"
                style={{
                  background:
                    'rgba(0, 245, 255, 0.03)',
                  border:
                    '1px solid rgba(0, 245, 255, 0.08)',
                }}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-sm font-medium text-white truncate">
                    {CATEGORY_LABELS[tx.categoryLabel] || 'Lainnya'}
                  </p>

                  <p className="text-xs text-gray-400 truncate">
                    {tx.description} • {formatDate(tx.dateTime)}
                  </p>
                </div>

                <p
                  className="font-semibold text-sm shrink-0 whitespace-nowrap text-right"
                  style={{
                    color:
                      tx.transactionType ===
                      'credit'
                        ? '#4ade80'
                        : '#f87171',
                  }}
                >
                  {tx.transactionType === 'credit'
                    ? '+'
                    : '-'}
                  Rp {formatCurrency(tx.amount)}
                </p>
              </motion.div>
            ))}

            {filteredTransactions.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-2 rounded-xl text-xs flex items-center justify-center gap-2"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={14} />
                    Lebih Sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    Lihat Semua
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}