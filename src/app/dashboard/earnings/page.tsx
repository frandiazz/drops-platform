'use client';

import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Wallet, ArrowUpRight, CheckCircle, Mail, Clock, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function EarningsPage() {
  const [user, setUser] = useState<any>(null);
  const [pendingSales, setPendingSales] = useState<any[]>([]);
  const [completedSales, setCompletedSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');

  const totalEarnings = completedSales.reduce((sum: number, s: any) => sum + parseFloat(s.creator_earnings || '0'), 0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      setUser(session.user);

      const { data: sales } = await supabase
        .from('sales')
        .select('*, content:content_id(title)')
        .eq('creator_id', session.user.id)
        .order('created_at', { ascending: false });

      if (sales) {
        setPendingSales(sales.filter(s => s.payment_status === 'pending'));
        setCompletedSales(sales.filter(s => s.payment_status === 'completed'));
      }
      setLoading(false);
    });
  }, []);

  const markAsPaid = async (saleId: string) => {
    const { error } = await supabase
      .from('sales')
      .update({ payment_status: 'completed' })
      .eq('id', saleId);

    if (error) {
      alert('Error: ' + error.message);
      return;
    }

    setPendingSales(prev => prev.filter(s => s.id !== saleId));
    const sale = pendingSales.find(s => s.id === saleId);
    if (sale) {
      setCompletedSales(prev => [{ ...sale, payment_status: 'completed' }, ...prev]);
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
      <div className="glass-card rounded-xl p-8 mb-8 text-center">
        <p className="text-sm text-muted mb-2">Balance disponible</p>
        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-cyan">${totalEarnings.toFixed(2)}</p>
        <p className="text-xs text-muted mt-3">Los pagos se acreditan entre 24-48hs después de solicitar el retiro.</p>
      </div>

      {/* Pending Sales */}
      {loading ? (
        <div className="text-center py-8 text-muted">Cargando ventas...</div>
      ) : pendingSales.length > 0 && (
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold">Ventas pendientes de verificación</h3>
            <span className="ml-auto text-sm bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded">{pendingSales.length}</span>
          </div>
          <div className="space-y-4">
            {pendingSales.map(sale => (
              <div key={sale.id} className="p-4 rounded-xl border border-slate-700/50 bg-dark-light/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                      <span className="text-sm text-white truncate">{sale.buyer_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <span className="text-accent-cyan font-bold">${sale.amount} USD</span>
                      <span>·</span>
                      <span>{sale.content?.title || 'Contenido'}</span>
                      <span>·</span>
                      <span className="capitalize">{sale.payment_method}</span>
                    </div>
                    <p className="text-xs text-muted">{new Date(sale.created_at).toLocaleString('es-AR')}</p>
                  </div>
                  <button
                    onClick={() => markAsPaid(sale.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg hover:bg-green-500/20 transition-colors flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar pagado
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && pendingSales.length === 0 && (
        <div className="glass-card rounded-xl p-6 mb-8 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <h3 className="font-bold mb-1">No hay ventas pendientes</h3>
          <p className="text-xs text-muted">Todas las ventas están al día.</p>
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

        <button className="mt-6 w-full sm:w-auto px-8 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2">
          <ArrowUpRight className="w-5 h-5" />
          Solicitar Retiro
        </button>
      </div>

      {/* Payment Methods Info */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-bold mb-6">Métodos de pago aceptados por Drops</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
            <CreditCard className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Tarjeta de crédito/débito</p>
              <p className="text-xs text-muted">Vía Takenos - Pagos internacionales en USD</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
            <Wallet className="w-6 h-6 text-accent-violet flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Mercado Pago</p>
              <p className="text-xs text-muted">Pagos en pesos argentinos</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
            <DollarSign className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Transferencia bancaria</p>
              <p className="text-xs text-muted">Cuenta Lead Bank - USD internacional</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-dark-light/50">
            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13H11v6l5.25 3.15-.75 1.23L10 14.5V7z"/></svg>
            <div>
              <p className="text-sm font-semibold">Criptomonedas</p>
              <p className="text-xs text-muted">USDT en red TRC20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
