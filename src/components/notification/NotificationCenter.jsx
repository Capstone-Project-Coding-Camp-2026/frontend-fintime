import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Trash2,
  CheckCheck,
  Inbox,
} from 'lucide-react'
import { useState } from 'react'
import { useToast, TOAST_CONFIGS } from '../../context/ToastContext'

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const SOURCE_LABELS = {
  toast: 'Toast',
  system: 'Sistem',
  alert: 'Peringatan',
  budget: 'Budget',
  debt: 'Hutang',
}

export default function NotificationCenter({ isOpen, onClose }) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useToast()
  const [filter, setFilter] = useState('all')

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === filter)

  const formatTime = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Baru saja'
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays < 7) return `${diffDays} hari lalu`
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed right-4 top-20 w-96 max-h-[calc(100vh-120px)] rounded-2xl overflow-hidden z-50 shadow-2xl"
            style={{
              background: 'rgba(6, 21, 40, 0.95)',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(0,245,255,0.1)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: 'rgba(0,245,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(0,245,255,0.1)',
                    border: '1px solid rgba(0,245,255,0.2)',
                  }}
                >
                  <Bell size={20} style={{ color: '#00f5ff' }} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'white' }}>
                    Notifikasi
                  </h3>
                  {unreadCount > 0 && (
                    <p className="text-xs" style={{ color: '#7aa6c2' }}>
                      {unreadCount} belum dibaca
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllAsRead}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                      style={{ color: '#7aa6c2' }}
                      title="Tandai semua sudah dibaca"
                    >
                      <CheckCheck size={18} />
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10 text-red-400"
                      title="Hapus semua"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              className="flex items-center gap-1 p-2 border-b"
              style={{ borderColor: 'rgba(0,245,255,0.08)' }}
            >
              {['all', 'success', 'error', 'warning', 'info'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === type ? '' : 'opacity-50'
                  }`}
                  style={{
                    background:
                      filter === type ? 'rgba(0,245,255,0.15)' : 'transparent',
                    color: filter === type ? '#00f5ff' : '#7aa6c2',
                  }}
                >
                  {type === 'all' ? 'Semua' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[400px] p-2">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'rgba(0,245,255,0.05)' }}
                  >
                    <Inbox size={32} style={{ color: '#7aa6c2' }} />
                  </div>
                  <p className="font-semibold" style={{ color: '#7aa6c2' }}>
                    Tidak ada notifikasi
                  </p>
                  <p className="text-xs text-center mt-1" style={{ color: '#5a8aab' }}>
                    Notifikasi akan muncul di sini
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification) => {
                    const config = TOAST_CONFIGS[notification.type] || TOAST_CONFIGS.info
                    const Icon = ICONS[notification.type] || Info

                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                        className={`flex items-start gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all hover:bg-white/5 ${
                          !notification.read ? 'bg-white/5' : ''
                        }`}
                        style={{
                          background: notification.read ? 'transparent' : 'rgba(0,245,255,0.03)',
                          border: `1px solid ${
                            notification.read ? 'transparent' : 'rgba(0,245,255,0.08)'
                          }`,
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: config.iconBg }}
                        >
                          <Icon size={16} style={{ color: config.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium leading-relaxed"
                            style={{ color: 'white' }}
                          >
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                background: config.iconBg,
                                color: config.iconColor,
                              }}
                            >
                              {SOURCE_LABELS[notification.source] || notification.source}
                            </span>
                            <span className="text-xs" style={{ color: '#5a8aab' }}>
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}