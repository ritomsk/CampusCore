import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', visible, isVisible, onClose }) => {
  const show = visible !== undefined ? visible : isVisible;

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show || !message) return null;

  const iconClass =
    type === 'success'
      ? 'fa-check-circle text-emerald-400'
      : type === 'error'
      ? 'fa-times-circle text-red-400'
      : 'fa-info-circle text-blue-400';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="bg-slate-900 text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800">
        <i className={`fas ${iconClass} text-lg`}></i>
        <span className="font-medium text-sm text-slate-100">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-slate-400 hover:text-white transition-colors focus:outline-none"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
