import React, { createContext, useContext, useState, useCallback } from 'react';

interface ToastContextType {
  toastMessage: string | null;
  showToast: (message: string, durationMs?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastMessage(null);
  }, []);

  const showToast = useCallback((message: string, durationMs: number = 2600) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastMessage(message);
    timerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, durationMs);
  }, []);

  return (
    <ToastContext.Provider value={{ toastMessage, showToast, hideToast }}>
      {children}
      {/* Global In-Canvas Floating Toast Display */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="absolute bottom-18 left-1/2 -translate-x-1/2 max-w-[90%] bg-[#201f1f]/95 border border-[#ffd405] text-white px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-2 z-50 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ffd405] shrink-0">check_circle</span>
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
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
