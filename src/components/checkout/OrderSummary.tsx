import Image from 'next/image';
import { memo } from 'react';
import { Check, Lock, Repeat } from 'lucide-react';

interface OrderSummaryProps {
  creatorName: string;
  creatorAvatar: string;
  packTitle: string;
  displayPrice: string;
  arsRate: number;
  packType: 'one_time' | 'subscription';
}

const OrderSummary = memo(function OrderSummary({ creatorName, creatorAvatar, packTitle, displayPrice, arsRate, packType }: OrderSummaryProps) {
  return (
    <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
      {creatorName && (
        <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-light/80 flex-shrink-0">
            {creatorAvatar ? (
              <Image src={creatorAvatar} alt={creatorName} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted">{creatorName.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted">Comprando a</p>
            <p className="text-sm font-semibold truncate">{creatorName}</p>
          </div>
        </div>
      )}

      <div className="aspect-square rounded-xl bg-dark-light/50 border border-slate-700/50 flex items-center justify-center">
        <span className="text-6xl">{'\u{1F4E6}'}</span>
      </div>
      <h2 className="text-xl font-bold">{packTitle}</h2>
      <p className="text-xs text-muted">Contenido exclusivo en Drops</p>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-black text-accent-cyan">${displayPrice}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted">USD</span>
          {packType === 'subscription' && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">/mes</span>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-500 text-right -mt-2">
        ≈ ARS $ {(parseFloat(displayPrice) * arsRate).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
      </p>

      <div className="space-y-3">
        {packType === 'subscription' ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted"><Repeat className="w-4 h-4 text-cyan-400" /><span>Se renueva automáticamente cada mes</span></div>
            <div className="flex items-center gap-2 text-sm text-green-400"><Check className="w-4 h-4" /><span>Cancelá cuando quieras, sin penalización</span></div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Acceso inmediato al pagar</span></div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Sin registro · Solo tarjeta</span></div>
        <div className="flex items-center gap-2 text-sm text-muted"><Lock className="w-4 h-4 text-green-400" /><span>Pago 100% seguro</span></div>
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <span>Contenido protegido por DMCA</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <div>
            <p className="text-[11px] font-semibold text-blue-400">Procesado por Mercado Pago</p>
            <p className="text-[10px] text-slate-500">Pago seguro · Datos tokenizados · Sin almacenamiento</p>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <svg className="w-8 h-8 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <div>
            <p className="text-[11px] font-semibold text-green-400">Garantía Drops</p>
            <p className="text-[10px] text-slate-500">Problema con tu compra? Te asistimos al instante · dropsdrops2005@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OrderSummary;
