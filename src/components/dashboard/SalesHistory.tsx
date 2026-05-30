import { CreditCard, DollarSign, Mail } from 'lucide-react';
import type { Sale } from '@/types';

interface SalesHistoryProps {
  sales: (Sale & { content?: { title?: string } })[];
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

export default function SalesHistory({ sales, loading, hasMore, loadingMore, onLoadMore }: SalesHistoryProps) {
  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 mb-8">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-700/30 rounded w-40" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-700/20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 mb-8 text-center">
        <DollarSign className="w-8 h-8 text-muted mx-auto mb-3" />
        <h3 className="font-bold mb-1">Todavía no hay ventas</h3>
        <p className="text-xs text-muted">Cuando alguien compre tu contenido, aparecerá acá.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-accent-cyan" />
        <h3 className="text-lg font-bold">Historial de ventas</h3>
        <span className="ml-auto text-sm bg-slate-700/30 text-muted px-2 py-0.5 rounded">{sales.length}</span>
      </div>
      <div className="space-y-4">
        {sales.map(sale => (
          <div key={sale.id} className="p-4 rounded-xl border border-slate-700/50 bg-dark-light/30">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                  <span className="text-sm text-white truncate">{sale.buyer_email}</span>
                  <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded ${
                    sale.payment_status === 'completed'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {sale.payment_status === 'completed' ? 'Pagado' : 'Pendiente'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted mb-1 flex-wrap">
                  <span className="text-accent-cyan font-bold">${sale.amount} USD</span>
                  <span>·</span>
                  <span>{sale.content?.title || 'Contenido'}</span>
                  <span>·</span>
                  <span className="capitalize">{sale.payment_method}</span>
                </div>
                {sale.payment_status === 'completed' && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-green-400">+${parseFloat(sale.creator_earnings || '0').toFixed(2)} para vos</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">Comisión Drops: ${parseFloat(sale.commission ?? '0').toFixed(2)} ({sale.amount > 0 ? Math.round(parseFloat(sale.commission ?? '0') / sale.amount * 100) : 0}%)</span>
                  </div>
                )}
                <p className="text-xs text-muted">{new Date(sale.created_at).toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button onClick={onLoadMore} disabled={loadingMore}
          className="mt-6 w-full py-3 text-sm text-muted hover:text-white border border-slate-700/50 rounded-lg transition-colors disabled:opacity-50">
          {loadingMore ? 'Cargando...' : 'Cargar más ventas'}
        </button>
      )}
    </div>
  );
}
