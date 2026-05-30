'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'default', onConfirm, onCancel }: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onCancel();
      };
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKey);
        document.body.style.overflow = '';
      };
    }
  }, [open, onCancel]);

  if (!open) return null;

  const confirmColors = {
    danger: 'bg-red-600 hover:bg-red-500 focus-visible:ring-red-400',
    warning: 'bg-amber-600 hover:bg-amber-500 focus-visible:ring-amber-400',
    default: 'bg-accent-violet hover:bg-violet-600 focus-visible:ring-accent-violet',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
        <button onClick={onCancel} className="absolute top-4 right-4 text-muted hover:text-white transition-colors" aria-label="Cerrar">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-start gap-4">
          {variant !== 'default' && (
            <div className={`p-2 rounded-full flex-shrink-0 ${variant === 'danger' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            <h2 id="confirm-title" className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-sm text-muted mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-slate-600/50 text-sm font-semibold text-muted hover:text-white hover:border-slate-500 transition-colors">
                {cancelLabel}
              </button>
              <button ref={confirmRef} onClick={onConfirm} className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${confirmColors[variant]}`}>
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
