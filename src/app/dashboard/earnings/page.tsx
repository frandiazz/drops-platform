'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Sale } from '@/types';
import EarningsBalance from '@/components/dashboard/EarningsBalance';
import SalesHistory from '@/components/dashboard/SalesHistory';
import WithdrawForm from '@/components/dashboard/WithdrawForm';
import PaymentMethodsInfo from '@/components/dashboard/PaymentMethodsInfo';

const PAGE_SIZE = 20;

export default function EarningsPage() {
  const [sales, setSales] = useState<(Sale & { content?: { title?: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [withdrawnTotal, setWithdrawnTotal] = useState(0);

  const totalEarnings = sales
    .filter(s => s.payment_status === 'completed')
    .reduce((sum, s) => sum + parseFloat(s.creator_earnings || '0'), 0);

  const availableBalance = totalEarnings - withdrawnTotal;

  const fetchSales = useCallback(async (pageNum: number, append: boolean) => {
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
      setSales(prev => [...prev, ...((data || []) as Sale[])]);
    } else {
      setSales((data || []) as Sale[]);
    }
    setHasMore((data || []).length === PAGE_SIZE);
  }, []);

  useEffect(() => {
    setLoading(true);
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: withdrawals } = await supabase
        .from('withdrawals')
        .select('amount')
        .eq('creator_id', session.user.id)
        .in('status', ['paid', 'approved']);

      setWithdrawnTotal((withdrawals || []).reduce((s, w) => s + parseFloat(String(w.amount || 0)), 0));
      await fetchSales(0, false);
    };
    init().finally(() => setLoading(false));
  }, [fetchSales]);

  const loadMore = useCallback(async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    await fetchSales(nextPage, true);
    setLoadingMore(false);
  }, [page, fetchSales]);

  const handleWithdraw = useCallback(async (amount: string, method: string): Promise<{ type: 'success' | 'error'; text: string }> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No autorizado');

      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ amount, method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al solicitar retiro');

      return { type: 'success', text: 'Solicitud de retiro enviada con éxito. Te contactaremos pronto.' };
    } catch (error: unknown) {
      return { type: 'error', text: error instanceof Error ? error.message : 'Error al solicitar retiro' };
    }
  }, []);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          Mis <span className="gradient-text">Ganancias</span>
        </h1>
        <p className="text-muted mt-1">Seguí tus ingresos y solicitá retiros.</p>
      </div>

      <EarningsBalance totalEarnings={totalEarnings} withdrawnTotal={withdrawnTotal} availableBalance={availableBalance} />
      <SalesHistory sales={sales} loading={loading} hasMore={hasMore} loadingMore={loadingMore} onLoadMore={loadMore} />
      <WithdrawForm onWithdraw={handleWithdraw} />
      <PaymentMethodsInfo />
    </div>
  );
}
