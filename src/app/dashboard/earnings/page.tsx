'use client';

import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Wallet, ArrowUpRight, Mail, CheckCircle, AlertCircle, TrendingDown, PiggyBank } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 20;

export default function EarningsPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const totalEarnings = sales
    .filter(s => s.payment_status === 'completed')
    .reduce((sum: number, s: any) => sum + parseFloat(s.creator_earnings || '0'), 0);

  const availableBalance = totalEarnings - withdrawnTotal;

  const fetchSales = async (pageNum: number, append: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const from = pageNum * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('sales')
      .select('*, content:content_id(title)', { count: 'exact' })
      .eq('creator_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) return;
    if (append) {
      setSales(prev => [...prev, ...(data || [])]);
    } else {
      setSales(data || []);
    }
    setHasMore((data || []).length === PAGE_SIZE);
  };

  useEffect(() => {
    setLoading(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // Fetch withdrawn total
      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('amount')
        .eq('creator_id', session.user.id)
        .in('status', ['paid', 'approved']);

      setWithdrawnTotal((withdrawals || []).reduce((s: number, w: any) => s + parseFloat(w.amount || '0'), 0));

      await fetchSales(0, false);
    };
    init().finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    await fetchSales(nextPage, true);
    setLoadingMore(false);
  };

  const handleWithdraw = async () => {
    setWithdrawMsg(null);
    if (!withdrawAmount || !withdrawMethod) {
      setWithdrawMsg({ type: 'error', text: 'Completá el monto y el método de retiro' });
      return;
    }
    setWithdrawing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No autorizado');

      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ amount: withdrawAmount, method: withdrawMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al solicitar retiro');

      setWithdrawMsg({ type: 'success', text: 'Solicitud de retiro enviada con éxito. Te contactaremos pronto.' });
      setWithdrawAmount('');
      setWithdrawMethod('');
    } catch (err: any) {
      setWithdrawMsg({ type: 'error', text: err.message || 'Error al solicitar retiro' });
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Mis <span className="gradient-text">Ganancias</span>
        </h1>
        <p className="text-muted mt-1">Seguí tus ingresos y solicitá retiros.</p>
      </div>

      {/* Balance */}
      <div className="glass-card rounded-xl p-8 mb-8">
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-sm text-muted mb-2 flex items-center justify-center gap-1.5"><TrendingDown className="w-4 h-4 text-green-400" /> Ganancias totales</p>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-cyan">${totalEarnings.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-2 flex items-center justify-center gap-1.5"><DollarSign className="w-4 h-4 text-blue-400" /> Ya retirado</p>
            <p className="text-3xl font-black text-white">${withdrawnTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted mb-2 flex items-center justify-center gap-1.5"><PiggyBank className="w-4 h-4 text-accent-violet" /> Disponible para retirar</p>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-cyan">${availableBalance.toFixed(2)}</p>
          </div>
        </div>
        <p className="text-xs text-muted text-center mt-4">Los pagos se acreditan entre 24-48hs después de aprobar el retiro. Mínimo: $50 USD.</p>
        {availableBalance > 0 && (
          <div className="mt-4 bg-dark-light/40 rounded-lg p-3">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Progreso para retirar (mín. $50)</span>
              <span>{Math.min(100, (availableBalance / 50) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full transition-all" style={{ width: `${Math.min(100, (availableBalance / 50) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Sales List */}
      {loading ? (
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-slate-700/30 rounded w-40" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-700/20 rounded-xl" />
            ))}
          </div>
        </div>
      ) : sales.length === 0 ? (
        <div className="glass-card rounded-xl p-6 mb-8 text-center">
          <DollarSign className="w-8 h-8 text-muted mx-auto mb-3" />
          <h3 className="font-bold mb-1">Todavía no hay ventas</h3>
          <p className="text-xs text-muted">Cuando alguien compre tu contenido, aparecerá acá.</p>
        </div>
      ) : (
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
                        <span className="text-slate-500">Comisión Drops: ${parseFloat(sale.commission || '0').toFixed(2)} (20%)</span>
                      </div>
                    )}
                    <p className="text-xs text-muted">{new Date(sale.created_at).toLocaleString('es-AR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-6 w-full py-3 text-sm text-muted hover:text-white border border-slate-700/50 rounded-lg transition-colors disabled:opacity-50"
            >
              {loadingMore ? 'Cargando...' : 'Cargar más ventas'}
            </button>
          )}
        </div>
      )}

      {/* Withdraw Form */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <h3 className="text-lg font-bold mb-6">Solicitar retiro</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Monto (USD)</label>
            <input
              type="number"
              min="50"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
              placeholder="Mínimo $50 USD"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Método de retiro</label>
            <select
              value={withdrawMethod}
              onChange={(e) => setWithdrawMethod(e.target.value)}
              className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors appearance-none"
            >
              <option value="" disabled>Seleccioná un método</option>
              <option value="bank">Transferencia bancaria (Lead Bank)</option>
              <option value="crypto">Criptomonedas (USDT TRC20)</option>
              <option value="mp">Mercado Pago (Argentina)</option>
            </select>
          </div>
        </div>

        {withdrawMethod && (
          <div className="mt-4 p-4 rounded-lg bg-dark-light/50 border border-slate-700/50">
            {withdrawMethod === 'bank' && (
              <div className="text-sm space-y-1">
                <p className="text-muted">Necesitás proporcionar:</p>
                <p className="text-white">• Nombre del titular</p>
                <p className="text-white">• Número de cuenta</p>
                <p className="text-white">• Número de ruta (routing)</p>
              </div>
            )}
            {withdrawMethod === 'crypto' && (
              <div className="text-sm space-y-1">
                <p className="text-muted">Necesitás proporcionar:</p>
                <p className="text-white">• Dirección de wallet USDT TRC20</p>
              </div>
            )}
            {withdrawMethod === 'mp' && (
              <div className="text-sm space-y-1">
                <p className="text-muted">Necesitás proporcionar:</p>
                <p className="text-white">• CVU o alias de Mercado Pago</p>
                <p className="text-white">• Nombre del titular</p>
              </div>
            )}
          </div>
        )}

        {withdrawMsg && (
          <div className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm ${
            withdrawMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {withdrawMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {withdrawMsg.text}
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={withdrawing}
          className="mt-6 w-full sm:w-auto px-8 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpRight className="w-5 h-5" />
          {withdrawing ? 'Enviando...' : 'Solicitar Retiro'}
        </button>
      </div>

      {/* Payment Methods Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Cómo cobrás tus ventas</h3>
        <p className="text-xs text-muted mb-4">Tus clientes pagan con tarjeta vía Mercado Pago (ARS). El cobro se acredita en tu cuenta de Mercado Pago. Después podés transferirlo a tu banco.</p>

        <h4 className="text-sm font-semibold text-muted mb-3">Tarjetas aceptadas para cobrar</h4>
        <div className="flex items-center gap-5 flex-wrap text-slate-400 mb-6">
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-dark-light/50">
            <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#1A1F71"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">VISA</text></svg>
            <span className="text-[10px]">Visa</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-dark-light/50">
            <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#EB001B"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">MC</text></svg>
            <span className="text-[10px]">Mastercard</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-dark-light/50">
            <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#2E77BC"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">AMEX</text></svg>
            <span className="text-[10px]">Amex</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-dark-light/50">
            <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#0066A2"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">DNRS</text></svg>
            <span className="text-[10px]">Diners</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-dark-light/50">
            <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#E87E1B"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">DISC</text></svg>
            <span className="text-[10px]">Discover</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
            <CreditCard className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Pago con tarjeta</p>
              <p className="text-xs text-muted">Visa, Mastercard, Amex, Diners, Discover - nacionales e internacionales</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
            <Wallet className="w-6 h-6 text-accent-violet flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Retiro a Mercado Pago</p>
              <p className="text-xs text-muted">Recibí los ARS en tu cuenta de Mercado Pago y transferí a tu banco</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
