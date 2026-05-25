'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, Repeat } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [statsData, setStatsData] = useState({ earnings: 0, sales: 0, content: 0, buyers: 0, subscribers: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      setUser(session.user);
      const uid = session.user.id;

      const [salesRes, contentRes] = await Promise.all([
        supabase.from('sales').select('*').eq('creator_id', uid),
        supabase.from('content').select('id', { count: 'exact', head: true }).eq('creator_id', uid),
      ]);

      const completedSales = (salesRes.data || []).filter((s: any) => s.payment_status === 'completed');
      const totalEarnings = completedSales.reduce((sum: number, s: any) => sum + parseFloat(s.creator_earnings || '0'), 0);
      const uniqueBuyers = new Set(completedSales.map((s: any) => s.buyer_email)).size;

      let subscribers = 0;
      try {
        const { count } = await supabase
          .from('subscriptions')
          .select('id', { count: 'exact', head: true })
          .eq('creator_id', uid)
          .eq('status', 'active');
        subscribers = count || 0;
      } catch {}

      setStatsData({
        earnings: totalEarnings,
        sales: completedSales.length,
        content: contentRes.count || 0,
        buyers: uniqueBuyers,
        subscribers,
      });
    });
  }, []);

  const stats = [
    { label: 'Ganancias totales', value: `$${statsData.earnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Ventas completadas', value: statsData.sales.toString(), icon: TrendingUp, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
    { label: 'Contenido subido', value: statsData.content.toString(), icon: Package, color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
    { label: 'Compradores únicos', value: statsData.buyers.toString(), icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  if (statsData.subscribers > 0) {
    stats.push({ label: 'Suscriptores activos', value: statsData.subscribers.toString(), icon: Repeat, color: 'text-cyan-400', bg: 'bg-cyan-500/10' });
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Bienvenido, <span className="gradient-text">{user?.email?.split('@')[0] || 'Creador'}</span>
        </h1>
        <p className="text-muted mt-1">Acá podés ver el rendimiento de tu contenido y tus ganancias.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Acciones rápidas</h3>
          <div className="space-y-3">
            <a href="/dashboard/content" className="flex items-center justify-between p-3 rounded-lg bg-dark-light/50 hover:bg-dark-light/80 transition-colors group">
              <span className="text-sm font-medium">Subir nuevo contenido</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent-cyan transition-colors" />
            </a>
            <a href="/dashboard/earnings" className="flex items-center justify-between p-3 rounded-lg bg-dark-light/50 hover:bg-dark-light/80 transition-colors group">
              <span className="text-sm font-medium">Solicitar retiro</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent-cyan transition-colors" />
            </a>
            <a href="/dashboard/settings" className="flex items-center justify-between p-3 rounded-lg bg-dark-light/50 hover:bg-dark-light/80 transition-colors group">
              <span className="text-sm font-medium">Configurar perfil</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent-cyan transition-colors" />
            </a>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Tu link de Drops</h3>
          <div className="p-3 rounded-lg bg-dark-light/50 border border-slate-700/50">
            <p className="text-sm text-muted mb-2">Compartí este link con tus fans:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm text-accent-cyan bg-dark/50 px-3 py-2 rounded">
                drops-ly.vercel.app/c/{user?.id || 'tu-usuario'}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(`https://drops-ly.vercel.app/c/${user?.id || 'tu-usuario'}`)}
                className="px-4 py-3 min-h-[44px] bg-accent-violet/20 text-accent-violet rounded-lg hover:bg-accent-violet/30 transition-colors text-sm font-medium"
              >
                Copiar
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-accent-violet/5 border border-accent-violet/20">
            <p className="text-sm text-muted">
              <strong className="text-white">Tip:</strong> Los pagos se acreditan entre 24-48hs después de solicitar el retiro. Mínimo: $50 USD.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
