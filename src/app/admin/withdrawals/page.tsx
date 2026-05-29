'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DollarSign, Check, X, ChevronLeft, LogOut, Copy, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/admin/login'); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
      if (profile?.role !== 'admin') { await supabase.auth.signOut(); router.push('/admin/login'); return; }
      fetchWithdrawals();
    });
  }, [filter]);

  const fetchWithdrawals = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    setLoading(true);
    const res = await fetch(`/api/admin/withdrawals?status=${filter}`, { headers: { authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.withdrawals) setWithdrawals(data.withdrawals);
    setLoading(false);
  };

  const handleAction = async (withdrawalId: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    setUpdating(withdrawalId);
    const res = await fetch('/api/admin/withdrawals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ withdrawalId, status }),
    });
    const data = await res.json();
    if (data.withdrawal) {
      setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, ...data.withdrawal } : w));
    }
    setUpdating(null);
  };

  const methodLabels: Record<string, string> = { bank: 'Transferencia bancaria', crypto: 'USDT TRC20', mp: 'Mercado Pago' };

  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0);

  const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
    pending: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'Pendiente' },
    approved: { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'Aprobado' },
    paid: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', label: 'Pagado' },
    rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'Rechazado' },
  };

  return (
    <div className="min-h-screen bg-dark">
      <header className="glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
            <svg className="w-7 h-7 text-accent-cyan" viewBox="0 0 32 40" fill="none">
              <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropW2)"/>
              <defs><linearGradient id="dropW2" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
            </svg>
            <h1 className="text-lg font-bold">Retiros</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/admin/login'); }} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {['pending', 'approved', 'paid', 'rejected'].map((s) => {
            const cfg = statusConfig[s];
            const Icon = cfg.icon;
            const count = withdrawals.length;
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`glass rounded-xl p-4 text-center transition-all ${filter === s ? 'ring-2 ring-accent-violet' : 'hover:bg-slate-800/30'}`}>
                <Icon className={`w-6 h-6 mx-auto mb-1 ${cfg.color}`} />
                <p className="text-2xl font-bold">{withdrawals.filter(w => w.status === s).length}</p>
                <p className="text-xs text-muted capitalize">{cfg.label}</p>
              </button>
            );
          })}
        </div>

        {filter === 'pending' && totalPending > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-yellow-400">Total pendiente por retirar</p>
              <p className="text-2xl font-bold text-white">${totalPending.toFixed(2)} USD</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted">Cargando retiros...</div>
        ) : withdrawals.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <DollarSign className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted">No hay solicitudes de retiro {filter === 'pending' ? 'pendientes' : `con estado "${filter}"`}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map(w => {
              const cfg = statusConfig[w.status] || statusConfig.pending;
              const StatusIcon = cfg.icon;
              return (
                <div key={w.id} className="glass rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-bold text-lg text-accent-cyan">${w.amount.toFixed(2)} USD</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                        </span>
                      </div>
                      <div className="text-sm text-muted space-y-1">
                        <p><span className="text-white">{w.creator_name || 'Sin nombre'}</span> · {w.creator_email}</p>
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
                            className="px-4 py-3 min-h-[44px] bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50">
                            <Check className="w-4 h-4" /> Aprobar
                          </button>
                          <button onClick={() => handleAction(w.id, 'rejected')} disabled={updating === w.id}
                            className="px-4 py-3 min-h-[44px] bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-semibold rounded-lg border border-red-500/30 transition-all flex items-center gap-2 disabled:opacity-50">
                            <X className="w-4 h-4" /> Rechazar
                          </button>
                        </>
                      )}
                      {w.status === 'approved' && (
                        <button onClick={() => handleAction(w.id, 'paid')} disabled={updating === w.id}
                          className="px-4 py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50">
                          <DollarSign className="w-4 h-4" /> Marcar como pagado
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
    </div>
  );
}
