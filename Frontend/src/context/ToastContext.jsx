import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let iconColor = 'var(--success)';
          if (toast.type === 'error') {
            Icon = AlertCircle;
            iconColor = 'var(--danger)';
          } else if (toast.type === 'info') {
            Icon = Info;
            iconColor = 'var(--accent-cyan)';
          }

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                className="btn-ghost btn-icon btn-sm"
                onClick={() => removeToast(toast.id)}
                style={{ padding: 2, height: 'auto', width: 'auto' }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
