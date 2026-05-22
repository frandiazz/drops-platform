'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Wallet, DollarSign, Zap, Shield, Mail, ArrowRight, Check, Copy, CheckCheck, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [mpReady, setMpReady] = useState(false);

  const packTitle = searchParams.get('title') || 'Premium Content Pack';
  const packPrice = searchParams.get('price') || '29.99';
  const creatorName = searchParams.get('creator') || 'Creador';
  const creatorId = searchParams.get('creatorId') || '';
  const packId = searchParams.get('packId') || '';

  const cardFormRef = useRef<HTMLDivElement>(null);
  const mpInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window.MercadoPago === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => setMpReady(true);
      document.head.appendChild(script);
    } else {
      setMpReady(true);
    }
  }, []);

  useEffect(() => {
    if (!mpReady || !cardFormRef.current || !window.MercadoPago) return;

    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
    mpInstanceRef.current = mp;

    const cardForm = mp.cardForm({
      amount: packPrice,
      autoMount: true,
      form: { id: 'cardform', cardholderName: { id: 'cardholderName' } },
      callbacks: {
        onSubmit: async (formData: any) => {
          setProcessing(true);
          setError('');

          try {
            const token = await mp.cardForm().createCardToken();
            const res = await fetch('/api/create-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                card_token: token.id,
                amount: parseFloat(packPrice),
                buyer_email: email,
                creator_id: creatorId,
                content_id: packId,
                payment_method: 'mercadopago',
              }),
            });

            const data = await res.json();

            if (data.success) {
              const token = data.sale.access_token;
              router.push(`/acceder/${token}`);
            } else {
              setError(data.error || 'Pago rechazado. Intentá de nuevo.');
            }
          } catch {
            setError('Error al procesar el pago. Intentá de nuevo.');
          } finally {
            setProcessing(false);
          }
        },
      },
    });

    return () => {
      try { cardForm.unmount(); } catch {}
    };
  }, [mpReady, email, packPrice, creatorId, packId, router]);

  const handleCardPay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresá tu email primero');
      return;
    }
    if (!creatorId || !packId) {
      setError('Error: datos del producto incompletos');
      return;
    }
    if (mpInstanceRef.current) {
      mpInstanceRef.current.cardForm().submit();
    }
  };

  const handleAltPayment = async (method: string, paymentUrl?: string) => {
    if (!email) {
      setError('Ingresá tu email primero');
      return;
    }
    if (!creatorId || !packId) {
      setError('Error: datos del producto incompletos');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_email: email,
          creator_id: creatorId,
          content_id: packId,
          amount: parseFloat(packPrice),
          payment_method: method,
        }),
      });

      const data = await res.json();
      if (!data.sale) throw new Error(data.error || 'Error');

      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
      }

      setError('');
      router.push(`/checkout/success?email=${encodeURIComponent(email)}&creator=${encodeURIComponent(creatorName)}&pack=${encodeURIComponent(packTitle)}&price=${packPrice}&saleId=${data.sale.id}`);
    } catch (err: any) {
      setError(err?.message || 'Error al procesar');
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={creatorId ? `/c/${creatorId}` : "/"} className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Volver
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <div className="aspect-square rounded-xl bg-dark-light/50 border border-slate-700/50 flex items-center justify-center mb-6">
                  <span className="text-6xl">{'\u{1F4E6}'}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{packTitle}</h2>
                <p className="text-xs text-muted mb-2">de <span className="text-white">{creatorName}</span></p>
                <p className="text-muted text-sm mb-4">Contenido exclusivo de alta calidad. Acceso inmediato después del pago.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-accent-cyan">${packPrice}</span>
                  <span className="text-xs text-muted">USD</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Acceso inmediato</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Sin registro necesario</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Pago seguro vía Mercado Pago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Checkout <span className="gradient-text">Express</span>
                </h1>
                <p className="text-muted">Pagá con tarjeta al instante. Sin registros, sin salir de esta página.</p>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">{error}</div>
              )}

              {/* Email */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold mb-4">1. Tu email</h3>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted flex-shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  />
                </div>
                <p className="text-xs text-muted mt-2">Recibí el contenido acá después del pago.</p>
              </div>

              {/* Card Payment */}
              <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold mb-6">2. Pagá con tarjeta</h3>
                <p className="text-xs text-muted mb-4">Total: <span className="text-white font-bold">${packPrice} USD</span></p>

                <form id="cardform" onSubmit={handleCardPay}>
                  <div className="space-y-4">
                    <div ref={cardFormRef}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Número de tarjeta</label>
                          <div id="form-checkout__cardNumber" className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-muted mb-2">Vencimiento</label>
                            <div id="form-checkout__expirationDate" className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white"></div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-muted mb-2">CVV</label>
                            <div id="form-checkout__securityCode" className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white"></div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-muted mb-2">Nombre del titular</label>
                          <input
                            id="cardholderName"
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                            placeholder="Como figura en la tarjeta"
                          />
                        </div>
                      </div>
                    </div>

                    <input id="form-checkout__identificationType" type="hidden" value="DNI" />
                    <input id="form-checkout__installments" type="hidden" value="1" />

                    <button
                      type="submit"
                      disabled={processing || !mpReady}
                      className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                    >
                      {processing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                      ) : !mpReady ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Cargando...</>
                      ) : (
                        <>Pagar ${packPrice} USD</>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Alternative Methods */}
              <details className="glass-card rounded-2xl overflow-hidden mb-6">
                <summary className="p-6 sm:p-8 cursor-pointer hover:bg-slate-800/20 transition-colors">
                  <h3 className="text-lg font-bold">Otros métodos de pago</h3>
                  <p className="text-xs text-muted mt-1">Cripto, transferencia bancaria</p>
                </summary>
                <div className="px-6 sm:px-8 pb-6 space-y-4">
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-dark-light/30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Criptomonedas (USDT TRC20)</p>
                        <p className="text-xs text-muted">Envía a esta dirección</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-dark/50 border border-slate-700/50">
                      <code className="flex-1 text-xs text-accent-cyan break-all">TBLGXxTTmKDhisVYwqmZR9dH57TWUpoNUB</code>
                      <button onClick={() => handleCopy('TBLGXxTTmKDhisVYwqmZR9dH57TWUpoNUB')} className="px-3 py-1.5 bg-accent-violet/20 text-accent-violet rounded text-xs font-medium hover:bg-accent-violet/30 transition-colors flex-shrink-0">
                        {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <button onClick={() => handleAltPayment('crypto')} disabled={processing} className="mt-3 w-full py-2 bg-yellow-500/10 text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-500/20 transition-colors disabled:opacity-50">
                      Ya transferí - Verificar pago
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-700/50 bg-dark-light/30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.312A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Transferencia bancaria (USD)</p>
                        <p className="text-xs text-muted">Lead Bank</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex justify-between p-2 rounded bg-dark/50"><span className="text-muted">Titular:</span><span className="text-white font-medium">Augusto Francisco Diaz</span></div>
                      <div className="flex justify-between p-2 rounded bg-dark/50"><span className="text-muted">Cuenta:</span><span className="text-white font-medium">219862671324</span></div>
                      <div className="flex justify-between p-2 rounded bg-dark/50"><span className="text-muted">Routing:</span><span className="text-white font-medium">101019644</span></div>
                    </div>
                    <button onClick={() => handleAltPayment('bank')} disabled={processing} className="w-full py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50">
                      Ya transferí - Verificar pago
                    </button>
                  </div>
                </div>
              </details>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center"><Zap className="w-6 h-6 text-accent-cyan mx-auto mb-2" /><p className="text-xs text-muted">Pago al instante</p></div>
                <div className="text-center"><Shield className="w-6 h-6 text-green-400 mx-auto mb-2" /><p className="text-xs text-muted">Pago seguro</p></div>
                <div className="text-center"><Mail className="w-6 h-6 text-accent-violet mx-auto mb-2" /><p className="text-xs text-muted">Contenido automático</p></div>
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
