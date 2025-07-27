import React, { createContext, ReactNode, useContext, useState } from 'react';
import Toast from './Toast';

interface ToastConfig {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  duration?: number;
  position?: 'top' | 'center' | 'bottom';
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: 'success' | 'error' | 'info' | 'warning',
    title?: string,
    duration?: number,
    position?: 'top' | 'center' | 'bottom'
  ) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string,
    duration: number = 3000,
    position: 'top' | 'center' | 'bottom' = 'top'
  ) => {
    const id = generateId();
    const newToast: ToastConfig = {
      id,
      message,
      type,
      title,
      duration,
      position,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      hideToast(id);
    }, duration + 300); // Add extra time for animation
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const hideAllToasts = () => {
    setToasts([]);
  };

  const showSuccess = (message: string, title?: string) =>
    showToast(message, 'success', title);

  const showError = (message: string, title?: string) =>
    showToast(message, 'error', title);

  const showInfo = (message: string, title?: string) =>
    showToast(message, 'info', title);

  const showWarning = (message: string, title?: string) =>
    showToast(message, 'warning', title);

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          visible={true}
          message={toast.message}
          type={toast.type}
          title={toast.title}
          duration={toast.duration || 3000}
          position={toast.position}
          onHide={() => hideToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
