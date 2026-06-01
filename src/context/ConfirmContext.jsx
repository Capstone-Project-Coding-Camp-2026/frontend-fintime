import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmContext = createContext();

export const useConfirm = () => {
  return useContext(ConfirmContext);
};

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolveFn, setResolveFn] = useState(null);

  const confirm = useCallback((msg) => {
    setMessage(msg);
    setIsOpen(true);
    return new Promise((resolve) => {
      setResolveFn(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveFn) resolveFn(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveFn) resolveFn(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleCancel}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
              style={{
                background: 'var(--dark-2, #061528)',
                border: '1px solid rgba(0, 245, 255, 0.1)',
                color: 'var(--text, #e0f7ff)'
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-red-500/10 text-red-400">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">Konfirmasi</h3>
                <p className="text-sm opacity-80 mb-6">{message}</p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-medium transition-all bg-white/5 hover:bg-white/10"
                  >
                    <X size={16} /> Batal
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-xl font-medium transition-all bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    <Check size={16} /> Ya, Lanjutkan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};
