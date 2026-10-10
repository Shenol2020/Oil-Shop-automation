import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'success', message } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="#10b981" />;
      case 'danger': return <AlertCircle size={18} color="#ef4444" />;
      default: return <Info size={18} color="#3b82f6" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      backgroundColor: '#1e293b',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.85rem 1.25rem',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      fontSize: '0.88rem',
      fontWeight: 600,
      minWidth: '280px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
