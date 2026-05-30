'use client';

import { CreditCard, Loader2, Lock, Shield, Check, AlertCircle, Zap, Search } from 'lucide-react';
import Script from 'next/script';
import { formatCardNumber, formatExpiry, detectCardBrand } from './cardUtils';

interface PaymentFormProps {
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvv: string;
  setCardCvv: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  docType: string;
  setDocType: (v: string) => void;
  docNumber: string;
  setDocNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  displayPrice: string;
  arsRate: number;
  packType: 'one_time' | 'subscription';
  processing: boolean;
  mpReady: boolean;
  error: string;
  handlePay: (e: React.FormEvent) => void;
  onMpReady: () => void;
}

export default function PaymentForm({
  cardNumber, setCardNumber,
  cardExpiry, setCardExpiry,
  cardCvv, setCardCvv,
  cardName, setCardName,
  docType, setDocType,
  docNumber, setDocNumber,
  email, setEmail,
  displayPrice, arsRate, packType,
  processing, mpReady, error, handlePay,
  onMpReady,
}: PaymentFormProps) {
  const brand = cardNumber ? detectCardBrand(cardNumber) : null;

  return (
    <div className="lg:col-span-3">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Checkout <span className="gradient-text">Express</span></h1>
        <p className="text-muted">Pagá con tarjeta al instante. Sin salir de esta página.</p>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />{error}
        </div>
      )}

      <form onSubmit={handlePay}>
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
          <h3 className="text-lg font-bold mb-4">Datos de la tarjeta</h3>
          <div className="bg-dark-light/40 border border-slate-700/40 rounded-xl p-4 mb-5 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">{packType === 'subscription' ? 'Precio mensual:' : 'Precio:'}</span>
              <span className="text-white font-bold">${displayPrice} USD{packType === 'subscription' ? ' /mes' : ''}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Pagás en ARS (tasa del día):</span>
              <span className="text-accent-cyan font-bold">ARS $ {(parseFloat(displayPrice) * arsRate).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
            </div>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-700/30">Tu tarjeta emitida en el exterior convertirá automáticamente. Recibís el contenido al instante.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Número de tarjeta</label>
              <div className="relative">
                <input type="text" inputMode="numeric" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} required
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors tracking-wider text-lg" />
                {brand && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase text-slate-400">{brand}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Vencimiento</label>
                <input type="text" inputMode="numeric" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} required
                  placeholder="MM / AA"
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-center text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">CVV</label>
                <input type="text" inputMode="numeric" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} required
                  placeholder="123"
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-center text-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Titular</label>
                <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} required
                  placeholder="Nombre"
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="input-docType" className="block text-sm font-medium text-muted mb-2">Tipo de doc.</label>
                <select id="input-docType" value={docType} onChange={(e) => setDocType(e.target.value)}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors appearance-none">
                  <option value="DNI">DNI</option>
                  <option value="CI">CI</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="input-docNumber" className="block text-sm font-medium text-muted mb-2">Número de documento</label>
                <input id="input-docNumber" type="text" inputMode="numeric" value={docNumber} onChange={(e) => setDocNumber(e.target.value.replace(/\D/g, '').slice(0, 20))} required
                  placeholder="12345678"
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="input-email" className="block text-sm font-medium text-muted mb-2">Email *</label>
              <input id="input-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="tu@email.com"
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
              <p className="text-[11px] text-muted mt-1">Usá este email para acceder a tu contenido después de la compra.</p>
            </div>
          </div>

          <button type="submit" disabled={processing || !mpReady}
            className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-lg mt-6">
            {processing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
            ) : !mpReady ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Inicializando pago...</>
            ) : (
              <><CreditCard className="w-5 h-5" /> Pagar ARS $ {(parseFloat(displayPrice) * arsRate).toLocaleString('es-AR', { maximumFractionDigits: 0 })}{packType === 'subscription' ? ' /mes' : ''}</>
            )}
          </button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Conexión segura</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Datos encriptados</span>
            <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Respaldado por MP</span>
          </div>
        </div>
      </form>
      <Script src="https://sdk.mercadopago.com/js/v2" strategy="afterInteractive" onLoad={onMpReady} />

      <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-8">
        <div className="text-center"><Zap className="w-6 h-6 text-accent-cyan mx-auto mb-2" /><p className="text-xs text-muted">Checkout express</p></div>
        <div className="text-center"><Lock className="w-6 h-6 text-green-400 mx-auto mb-2" /><p className="text-xs text-muted">Pago 100% seguro</p></div>
        <div className="text-center"><Check className="w-6 h-6 text-accent-violet mx-auto mb-2" /><p className="text-xs text-muted">Acceso instantáneo</p></div>
      </div>

      <div className="mt-6 glass-card rounded-xl p-5 text-center">
        <p className="text-xs font-semibold text-muted mb-3">Tarjetas aceptadas</p>
        <div className="flex items-center justify-center gap-5 flex-wrap text-slate-400">
          {[
            { name: 'Visa', bg: '#1A1F71', text: 'VISA', size: 7 },
            { name: 'Mastercard', bg: '#EB001B', text: 'MC', size: 7 },
            { name: 'Amex', bg: '#2E77BC', text: 'AMEX', size: 6 },
            { name: 'Diners', bg: '#0066A2', text: 'DNRS', size: 6 },
            { name: 'Discover', bg: '#E87E1B', text: 'DISC', size: 6 },
          ].map(({ name, bg, text, size }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <svg className="w-10 h-7" viewBox="0 0 50 30">
                <rect width="50" height="30" rx="4" fill={bg} />
                <text x="25" y="19" textAnchor="middle" fill="white" fontSize={size} fontWeight="bold">{text}</text>
              </svg>
              <span className="text-[10px]">{name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-3">Aceptamos tarjetas nacionales e internacionales</p>
      </div>
    </div>
  );
}
