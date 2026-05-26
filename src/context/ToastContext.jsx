import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

// Toast types with default configurations
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
}

export const TOAST_CONFIGS = {
  success: {
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    iconColor: '#22c55e',
    iconBg: 'rgba(34, 197, 94, 0.15)',
  },
  error: {
    bgColor: 'rgba(248, 113, 113, 0.1)',
    borderColor: 'rgba(248, 113, 113, 0.3)',
    iconColor: '#f87171',
    iconBg: 'rgba(248, 113, 113, 0.15)',
  },
  warning: {
    bgColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    iconColor: '#fbbf24',
    iconBg: 'rgba(251, 191, 36, 0.15)',
  },
  info: {
    bgColor: 'rgba(0, 245, 255, 0.08)',
    borderColor: 'rgba(0, 245, 255, 0.2)',
    iconColor: '#00f5ff',
    iconBg: 'rgba(0, 245, 255, 0.1)',
  },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const addToast = useCallback((message, type = TOAST_TYPES.SUCCESS, duration = 4000) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type,
      timestamp: new Date(),
    }

    setToasts((prev) => [...prev, toast])

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    // Also add to notification center
    addNotification(message, type, 'toast')

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addNotification = useCallback((message, type = TOAST_TYPES.INFO, source = 'system') => {
    const id = Date.now() + Math.random()
    const notification = {
      id,
      message,
      type,
      source, // 'toast' | 'system' | 'alert' | 'budget' | 'debt'
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [notification, ...prev].slice(0, 50)) // Keep last 50
    setUnreadCount((prev) => prev + 1)

    return id
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Helper methods
  const success = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.SUCCESS, duration)
  }, [addToast])

  const error = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.ERROR, duration)
  }, [addToast])

  const warning = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.WARNING, duration)
  }, [addToast])

  const info = useCallback((message, duration) => {
    return addToast(message, TOAST_TYPES.INFO, duration)
  }, [addToast])

  const value = {
    toasts,
    notifications,
    unreadCount,
    addToast,
    removeToast,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    success,
    error,
    warning,
    info,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastContext