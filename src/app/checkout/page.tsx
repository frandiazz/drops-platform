'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { CreditCard, Zap, Shield, Check, Loader2, AlertCircle, Lock, User, Repeat } from 'lucide-react';

interface MercadoPagoInstance {
  checkout: (opts: { preference: { id: string }; render: { container: string; label: string } }) => void;
}

declare global {
  interface Window { MercadoPago: new (key: string, opts?: { locale: string }) => MercadoPagoInstance; }
}

const CARD_BRANDS: Record<string, string> = {
  '4': 'visa',
  '51': 'master', '52': 'master', '53': 'master', '54': 'master', '55': 'master',
  '34': 'amex', '37': 'amex',
  '300': 'diners', '301': 'diners', '302': 'diners', '303': 'diners', '304': 'diners', '305': 'diners', '36': 'diners', '38': 'diners', '39': 'diners',
  '6011': 'discover', '622': 'discover', '64': 'discover', '65': 'discover',
};

function detectCardBrand(number: string): string {
  const clean = number.replace(/\s/g, '');
  for (const [prefix, brand] of Object.entries(CARD_BRANDS)) {
    if (clean.startsWith(prefix)) return brand;
  }
  return 'master';
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

const SANITIZE = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [docType, setDocType] = useState('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [arsRate, setArsRate] = useState<number>(1200);
  const [mpReady, setMpReady] = useState(false);
  const [mpInstance, setMpInstance] = useState<any>(null);
  const [loadingPack, setLoadingPack] = useState(true);

  const [packTitle, setPackTitle] = useState('Cargando...');
  const [packPrice, setPackPrice] = useState('0');
  const [creatorId, setCreatorId] = useState('');
  const [packId, setPackId] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [creatorAvatar, setCreatorAvatar] = useState('');
  const [packType, setPackType] = useState<'one_time' | 'subscription'>('one_time');
  const [packSubPrice, setPackSubPrice] = useState('0');

  const displayPrice = packType === 'subscription' ? packSubPrice : packPrice;

  useEffect(() => {
    const pId = searchParams.get('packId') || '';
    const cId = searchParams.get('creatorId') || '';
    setPackId(pId);
    setCreatorId(cId);

    fetch(`/api/pack?packId=${encodeURIComponent(pId)}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) {
          setError('Pack no encontrado');
          setLoadingPack(false);
          return;
        }
        setPackTitle(SANITIZE(d.title || 'Premium Content Pack'));
        setPackPrice(String(d.price || '29.99'));
        setCreatorId(d.creatorId || cId);
        setCreatorName(SANITIZE(d.creatorName || ''));
        setCreatorAvatar(d.creatorAvatar || '');
        setPackType(d.type || 'one_time');
        setPackSubPrice(String(d.subscriptionPrice || d.price || '9.99'));
        setLoadingPack(false);
      })
      .catch(() => {
        setError('Error al cargar el producto');
        setLoadingPack(false);
      });

    fetch('/api/rate').then(r => r.json()).then(d => setArsRate(d.rate)).catch(() => {});
    if (typeof window.MercadoPago !== 'undefined') {
      setMpInstance(new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''));
      setMpReady(true);
    }
  }, [searchParams]);

  const onMpReady = () => {
    if (typeof window.MercadoPago !== 'undefined') {
      setMpInstance(new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || ''));
      setMpReady(true);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!cleanNumber || !cardExpiry || !cardCvv || !cardName || !docNumber) {
      setError('Completá todos los campos');
      return;
    }
    if (!creatorId || !packId) { setError('Error: datos del producto'); return; }
    if (!mpInstance) { setError('Cargando plataforma de pago...'); return; }

    setProcessing(true);
    setError('');

    try {
      const [expMonth, expYear] = cardExpiry.split('/');
      const fullYear = expYear?.length === 2 ? `20${expYear}` : expYear;

      const cardToken = await mpInstance.createCardToken({
        cardNumber: cleanNumber,
        cardExpirationMonth: expMonth || '12',
        cardExpirationYear: fullYear || '2026',
        securityCode: cardCvv,
        cardholderName: cardName,
        identificationType: docType,
        identificationNumber: docNumber,
      });

      const brand = detectCardBrand(cardNumber);
      const guestEmail = `guest-${crypto.randomUUID().slice(0, 8)}@drops.agency`;

      const res = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: cardToken.id,
          payment_method_id: cardToken.payment_method?.id || brand,
          amount: parseFloat(displayPrice),
          buyer_email: guestEmail,
          creator_id: creatorId,
          content_id: packId,
          title: packTitle,
          identification: { type: docType, number: docNumber },
          content_type: packType,
          idempotency_key: crypto.randomUUID(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/acceder/${data.access_token}`);
      } else {
        setError(data.error || 'Pago rechazado');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : err instanceof Object && 'cause' in err ? String(err.cause) : 'Error al procesar el pago');
    } finally {
      setProcessing(false);
    }
  };

  if (loadingPack) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted animate-pulse">Cargando producto...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <meta name="referrer" content="no-referrer" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={creatorId ? `/c/${creatorId}` : "/"} className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Volver
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">

                {/* Creator info */}
                {creatorName && (
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-700/30">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-light/80 flex-shrink-0">
                      {creatorAvatar ? (
                        <img src={creatorAvatar} alt={creatorName} loading="lazy" className="w-full h-full object-cover" />
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

                {/* Product info */}
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

                {/* Trust badges */}
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
                  <div className="flex items-center gap-2 text-sm text-amber-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg><span>Contenido protegido por DMCA</span></div>
                </div>

                {/* MP badge + Garantía */}
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
                      <p className="text-[10px] text-slate-500">Problema con tu compra? Te asistimos al instante · hola@drops.agency</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                      <input type="text" inputMode="numeric" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} required
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors tracking-wider text-lg" />
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
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#1A1F71"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">VISA</text></svg>
                    <span className="text-[10px]">Visa</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#EB001B"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">MC</text></svg>
                    <span className="text-[10px]">Mastercard</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#2E77BC"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">AMEX</text></svg>
                    <span className="text-[10px]">Amex</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#0066A2"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">DNRS</text></svg>
                    <span className="text-[10px]">Diners</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-10 h-7" viewBox="0 0 50 30"><rect width="50" height="30" rx="4" fill="#E87E1B"/><text x="25" y="19" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">DISC</text></svg>
                    <span className="text-[10px]">Discover</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3">Aceptamos tarjetas nacionales e internacionales</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
