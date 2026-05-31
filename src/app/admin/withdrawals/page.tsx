'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, Check, X, ChevronLeft, LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Withdrawal {
  id: string;
  creator_id: string;
  amount: number;
  method: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  paid_at: string | null;
  rejected_at: string | null;
  creator_name: string;
  creator_email: string;
}

const methodLabels: Record<string, string> = {
  bank: 'Transferencia bancaria',
  crypto: 'USDT TRC20',
  mp: 'Mercado Pago',
};

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Pendiente' },
  approved: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'Aprobado' },
  paid: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', label: 'Pagado' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Rechazado' },
};

const statBadges: Record<string, { bg: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pending: { bg: 'bg-yellow-500/10', icon: Clock, color: 'text-yellow-400' },
  approved: { bg: 'bg-blue-500/10', icon: CheckCircle, color: 'text-blue-400' },
  paid: { bg: 'bg-green-500/10', icon: CheckCircle, color: 'text-green-400' },
  rejected: { bg: 'bg-red-500/10', icon: XCircle, color: 'text-red-400' },
};

function SkeletonWithdrawals() {
  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-8 w-40 bg-slate-800/50 animate-pulse rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 glass rounded-xl p-4">
              <div className="w-6 h-6 bg-slate-800/50 animate-pulse rounded mx-auto mb-2" />
              <div className="h-8 w-12 bg-slate-800/50 animate-pulse rounded mx-auto mb-1" />
              <div className="h-4 w-16 bg-slate-800/30 animate-pulse rounded mx-auto" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 glass rounded-xl p-5">
              <div className="h-5 w-32 bg-slate-800/50 animate-pulse rounded mb-3" />
              <div className="h-4 w-64 bg-slate-800/30 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (profile?.role !== 'admin') { await supabase.auth.signOut(); router.push('/admin/login'); return; }
      fetchWithdrawals();
    });
  }, [router, filter]);

  useEffect(() => {
    if (!loading && withdrawals.length === 0) return;
  }, [loading, withdrawals]);

  const fetchWithdrawals = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/withdrawals?status=${filter}`, { headers: { authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.withdrawals) {
        setWithdrawals(data.withdrawals);
      } else if (data.error) {
        addToast(data.error, 'error');
      }
    } catch {
      addToast('Error al cargar retiros', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (withdrawalId: string, status: string) => {
    setUpdating(withdrawalId);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setUpdating(null); return; }
    try {
      const res = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ withdrawalId, status }),
      });
      const data = await res.json();
      if (data.withdrawal) {
        setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, ...data.withdrawal } : w));
        const label = status === 'approved' ? 'Aprobado' : status === 'paid' ? 'Pagado' : 'Rechazado';
        addToast(`Retiro ${label.toLowerCase()} correctamente`, 'success');
      } else {
        addToast(data.error || 'Error al procesar', 'error');
      }
    } catch {
      addToast('Error de conexión', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);

  if (loading) {
    return <SkeletonWithdrawals />;
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
            <Logo size={28} showText={false} />
            <h1 className="text-lg font-bold"><span className="gradient-text">Retiros</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login'); }} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-slide-up">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {['pending', 'approved', 'paid', 'rejected'].map((s) => {
            const badge = statBadges[s];
            const BadgeIcon = badge.icon;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`glass-card rounded-xl p-4 text-center transition-all ${filter === s ? 'ring-2 ring-accent-violet' : ''}`}>
                <div className={`w-10 h-10 rounded-lg ${badge.bg} flex items-center justify-center mx-auto mb-2`}>
                  <BadgeIcon className={`w-5 h-5 ${badge.color}`} />
                </div>
                <p className="text-2xl font-bold">{withdrawals.filter(w => w.status === s).length}</p>
                <p className="text-xs text-muted capitalize">{s}</p>
              </button>
            );
          })}
        </div>

        {filter === 'pending' && totalPending > 0 && (
          <div className="mb-6 p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between glass-card">
            <div>
              <p className="text-sm font-semibold text-yellow-400">Total pendiente por retirar</p>
              <p className="text-2xl font-black gradient-text">${totalPending.toFixed(2)} USD</p>
            </div>
          </div>
        )}

        {withdrawals.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <DollarSign className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted font-medium">No hay solicitudes de retiro</p>
            <p className="text-xs text-muted mt-1">{filter === 'pending' ? 'Cuando un creador solicite un retiro, aparecerá acá.' : `No hay retiros con estado "${filter}"`}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map(w => {
              const cfg = statusConfig[w.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={w.id} className="glass-card rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-black text-lg gradient-text">${w.amount.toFixed(2)} USD</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                        </span>
                      </div>
                      <div className="text-sm text-muted space-y-1">
                        <p><span className="text-white font-medium">{w.creator_name || 'Sin nombre'}</span> · {w.creator_email}</p>
                        <p>Método: {methodLabels[w.method] || w.method}</p>
                        <p className="text-xs">Solicitado: {new Date(w.created_at).toLocaleString('es-AR')}</p>
                        {w.approved_at && <p className="text-xs">Aprobado: {new Date(w.approved_at).toLocaleString('es-AR')}</p>}
                        {w.paid_at && <p className="text-xs text-green-400">Pagado: {new Date(w.paid_at).toLocaleString('es-AR')}</p>}
                        {w.rejected_at && <p className="text-xs text-red-400">Rechazado: {new Date(w.rejected_at).toLocaleString('es-AR')}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {w.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(w.id, 'approved')} disabled={updating === w.id}
                            className="px-4 py-3 min-h-[44px] bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg neon-glow transition-all flex items-center gap-2 disabled:opacity-50">
                            {updating === w.id ? (
                              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <><Check className="w-4 h-4" /> Aprobar</>
                            )}
                          </button>
                          <button onClick={() => setConfirmAction({ id: w.id, status: 'rejected' })} disabled={updating === w.id}
                            className="px-4 py-3 min-h-[44px] bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-semibold rounded-lg border border-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50">
                            <X className="w-4 h-4" /> Rechazar
                          </button>
                        </>
                      )}
                      {w.status === 'approved' && (
                        <button onClick={() => setConfirmAction({ id: w.id, status: 'paid' })} disabled={updating === w.id}
                          className="px-4 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg neon-glow transition-all flex items-center gap-2 disabled:opacity-50">
                          {updating === w.id ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <><DollarSign className="w-4 h-4" /> Marcar como pagado</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction?.status === 'paid' ? 'Marcar como pagado' : 'Rechazar retiro'}
        message={confirmAction?.status === 'paid'
          ? 'Confirmá que ya realizaste la transferencia al creador. Esta acción no se puede deshacer.'
          : 'El retiro será rechazado. Esta acción no se puede deshacer. ¿Continuar?'}
        confirmLabel={confirmAction?.status === 'paid' ? 'Sí, marcar pagado' : 'Rechazar'}
        variant={confirmAction?.status === 'rejected' ? 'danger' : 'warning'}
        onConfirm={() => {
          if (!confirmAction) return;
          handleAction(confirmAction.id, confirmAction.status);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
