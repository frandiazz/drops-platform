'use client';

import { useState, useEffect } from 'react';
import { Repeat, Mail, Calendar, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data } = await supabase
        .from('subscriptions')
        .select('*, content:content_id(title)')
        .eq('creator_id', session.user.id)
        .order('created_at', { ascending: false });
      if (data) setSubscriptions(data);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (subId: string) => {
    if (!confirm('¿Estás seguro de cancelar esta suscripción? El comprador dejará de ser cobrado mensualmente.')) return;
    setCancelling(subId);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) { setCancelling(null); return; }

    const res = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ subscriptionId: subId }),
    });

    const data = await res.json();
    if (data.success) {
      setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'canceled' } : s));
    } else {
      alert(data.error || 'Error al cancelar');
    }
    setCancelling(null);
  };

  const activeCount = subscriptions.filter(s => s.status === 'active').length;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Suscripciones <span className="gradient-text">Activas</span>
        </h1>
        <p className="text-muted mt-1">Gestioná los suscriptores de tus packs mensuales.</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted">Cargando suscripciones...</div>
      ) : subscriptions.length === 0 ? (
        <div className="glass-card rounded-xl p-6 text-center">
          <Repeat className="w-8 h-8 text-muted mx-auto mb-3" />
          <h3 className="font-bold mb-1">Sin suscripciones activas</h3>
          <p className="text-xs text-muted">Cuando alguien se suscriba a un pack mensual, aparecerá acá.</p>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <Repeat className="w-6 h-6 text-accent-cyan" />
              <span className="text-lg font-bold">{activeCount} suscriptor{activeCount !== 1 ? 'es' : ''} activo{activeCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="divide-y divide-slate-800/50">
              {subscriptions.map(sub => (
                <div key={sub.id} className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-muted flex-shrink-0" />
                        <span className="text-sm text-white truncate">{sub.buyer_email}</span>
                        <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded ${
                          sub.status === 'active'
                            ? 'bg-green-500/10 text-green-400'
                            : sub.status === 'canceled'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {sub.status === 'active' ? 'Activa' : sub.status === 'canceled' ? 'Cancelada' : sub.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted mb-1 flex-wrap">
                        <span className="text-accent-cyan font-bold">${sub.amount} USD/mes</span>
                        <span>·</span>
                        <span>{sub.content?.title || 'Contenido'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Calendar className="w-3 h-3" />
                        <span>Inicio: {new Date(sub.current_period_start).toLocaleDateString('es-AR')}</span>
                        {sub.current_period_end && (
                          <>
                            <span>·</span>
                            <Calendar className="w-3 h-3" />
                            <span>Próximo vencimiento: {new Date(sub.current_period_end).toLocaleDateString('es-AR')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {sub.status === 'active' && (
                      <button
                        onClick={() => handleCancel(sub.id)}
                        disabled={cancelling === sub.id}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        {cancelling === sub.id ? 'Cancelando...' : 'Cancelar'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted">
              Al cancelar una suscripción, el suscriptor perderá el acceso al contenido al final del período facturado actual.
              El reembolso debe gestionarse manualmente si corresponde.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
