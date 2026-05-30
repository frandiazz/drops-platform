import { memo } from 'react';
import { DollarSign, TrendingDown, PiggyBank } from 'lucide-react';

interface EarningsBalanceProps {
  totalEarnings: number;
  withdrawnTotal: number;
  availableBalance: number;
}

const EarningsBalance = memo(function EarningsBalance({ totalEarnings, withdrawnTotal, availableBalance }: EarningsBalanceProps) {
  return (
    <div className="glass-card rounded-xl p-8 mb-8">
      <div className="grid sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-muted mb-2 flex items-center justify-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-green-400" /> Ganancias totales
          </p>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-cyan">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted mb-2 flex items-center justify-center gap-1.5">
            <DollarSign className="w-4 h-4 text-blue-400" /> Ya retirado
          </p>
          <p className="text-3xl font-black text-white">${withdrawnTotal.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted mb-2 flex items-center justify-center gap-1.5">
            <PiggyBank className="w-4 h-4 text-accent-violet" /> Disponible para retirar
          </p>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-cyan">
            ${availableBalance.toFixed(2)}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted text-center mt-4">
        Los pagos se acreditan entre 24-48hs después de aprobar el retiro. Mínimo: $50 USD.
      </p>
      {availableBalance > 0 && (
        <div className="mt-4 bg-dark-light/40 rounded-lg p-3">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Progreso para retirar (mín. $50)</span>
            <span>{Math.min(100, (availableBalance / 50) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-700/50 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full transition-all"
              style={{ width: `${Math.min(100, (availableBalance / 50) * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
});

export default EarningsBalance;
