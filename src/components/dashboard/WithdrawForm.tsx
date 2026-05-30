'use client';

import { useState } from 'react';
import { ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';

interface WithdrawFormProps {
  onWithdraw: (amount: string, method: string) => Promise<{ type: 'success' | 'error'; text: string }>;
}

export default function WithdrawForm({ onWithdraw }: WithdrawFormProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleWithdraw = async () => {
    setWithdrawMsg(null);
    if (!withdrawAmount || !withdrawMethod) {
      setWithdrawMsg({ type: 'error', text: 'Completá el monto y el método de retiro' });
      return;
    }
    setWithdrawing(true);
    const result = await onWithdraw(withdrawAmount, withdrawMethod);
    setWithdrawMsg(result);
    if (result.type === 'success') {
      setWithdrawAmount('');
      setWithdrawMethod('');
    }
    setWithdrawing(false);
  };

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <h3 className="text-lg font-bold mb-6">Solicitar retiro</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Monto (USD)</label>
          <input type="number" min="50" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
            className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
            placeholder="Mínimo $50 USD" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Método de retiro</label>
          <select value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value)}
            className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors appearance-none">
            <option value="" disabled>Seleccioná un método</option>
            <option value="bank">Transferencia bancaria</option>
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

      <button onClick={handleWithdraw} disabled={withdrawing}
        className="mt-6 w-full sm:w-auto px-8 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
        <ArrowUpRight className="w-5 h-5" />
        {withdrawing ? 'Enviando...' : 'Solicitar Retiro'}
      </button>
    </div>
  );
}
