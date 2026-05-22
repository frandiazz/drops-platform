'use client';

import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Wallet, DollarSign, Zap, Shield, Mail, ArrowRight, Check, Copy, CheckCheck } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const packTitle = searchParams.get('title') || 'Premium Content Pack';
  const packPrice = searchParams.get('price') || '29.99';
  const creatorName = searchParams.get('creator') || 'Creador';
  const creatorId = searchParams.get('creatorId') || '';
  const packId = searchParams.get('packId') || '';

  const [saleCreated, setSaleCreated] = useState<{ id: string; method: string } | null>(null);

  const handlePayment = async (method: string, paymentUrl?: string) => {
    if (!email) {
      alert('Ingresá tu email primero');
      return;
    }
    if (!creatorId || !packId) {
      alert('Error: datos del producto incompletos');
      return;
    }

    setProcessing(true);

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
      if (!data.sale) throw new Error('No sale created');

      setSaleCreated({ id: data.sale.id, method });

      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
      }
    } catch {
      alert('Error al procesar la compra. Intentalo de nuevo.');
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
                    <span>Pago seguro</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Checkout <span className="gradient-text">Express</span>
                </h1>
                <p className="text-muted">Solo necesitás tu email y método de pago. Sin registros, sin contraseñas.</p>
              </div>

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
                <p className="text-xs text-muted mt-2">Te enviaremos el contenido a este email después de verificar el pago.</p>
              </div>

              {saleCreated ? (
                <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pago iniciado</h3>
                  <p className="text-muted text-sm mb-4">
                    Abrimos el link de pago en una nueva pestaña. Completá el pago desde allí.
                  </p>
                  <div className="p-4 rounded-lg bg-dark-light/50 border border-slate-700/50 mb-4">
                    <p className="text-xs text-muted mb-1">ID de transacción:</p>
                    <code className="text-accent-cyan text-sm">{saleCreated.id}</code>
                  </div>
                  <p className="text-xs text-muted">
                    El creador verificará el pago manualmente y te enviará el contenido a <strong className="text-white">{email}</strong> dentro de las próximas 24-48 horas.
                  </p>
                  <div className="mt-6 p-4 rounded-lg bg-accent-violet/10 border border-accent-violet/30">
                    <p className="text-xs text-muted">
                      <strong className="text-white">Importante:</strong> Guardá el ID de transacción. Si tenés alguna duda, escribinos a DropsDrops2005@gmail.com con ese ID.
                    </p>
                  </div>
                </div>
              ) : (
              <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold mb-6">2. Elegí tu método de pago</h3>
                <p className="text-xs text-muted mb-4">Total a pagar: <span className="text-white font-bold">${packPrice} USD</span></p>

                <div className="space-y-4">
                  <button
                    onClick={() => handlePayment('card', 'https://app.takenos.com/pay/a1b71309-95c7-4b50-9e65-e614f29a79cb')}
                    disabled={processing}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-dark-light/30 hover:border-accent-violet/50 hover:bg-dark-light/50 transition-all group disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent-violet/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-accent-violet" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold">Tarjeta de crédito o débito</p>
                      <p className="text-xs text-muted">Pago internacional en USD</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent-cyan transition-colors flex-shrink-0" />
                  </button>

                  <button
                    onClick={() => handlePayment('mercadopago', 'https://mpago.la/1jztdtA')}
                    disabled={processing}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-dark-light/30 hover:border-accent-violet/50 hover:bg-dark-light/50 transition-all group disabled:opacity-50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold">Mercado Pago</p>
                      <p className="text-xs text-muted">Pagos en pesos argentinos</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent-cyan transition-colors flex-shrink-0" />
                  </button>

                  <div className="p-4 rounded-xl border border-slate-700/50 bg-dark-light/30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Criptomonedas (USDT TRC20)</p>
                        <p className="text-xs text-muted">Envía <span className="text-white font-bold">${packPrice} USD</span> a esta dirección</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-dark/50 border border-slate-700/50">
                      <code className="flex-1 text-xs text-accent-cyan break-all">TBLGXxTTmKDhisVYwqmZR9dH57TWUpoNUB</code>
                      <button
                        onClick={() => handleCopy('TBLGXxTTmKDhisVYwqmZR9dH57TWUpoNUB')}
                        className="px-3 py-1.5 bg-accent-violet/20 text-accent-violet rounded text-xs font-medium hover:bg-accent-violet/30 transition-colors flex-shrink-0"
                      >
                        {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => handlePayment('crypto')}
                      disabled={processing}
                      className="mt-3 w-full py-2 bg-yellow-500/10 text-yellow-400 text-sm font-medium rounded-lg hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                    >
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
                        <p className="text-xs text-muted">Cuenta internacional Lead Bank</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs mb-3">
                      <div className="flex justify-between p-2 rounded bg-dark/50">
                        <span className="text-muted">Titular:</span>
                        <span className="text-white font-medium">Augusto Francisco Diaz</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-dark/50">
                        <span className="text-muted">Cuenta:</span>
                        <span className="text-white font-medium">219862671324</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-dark/50">
                        <span className="text-muted">Routing:</span>
                        <span className="text-white font-medium">101019644</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePayment('bank')}
                      disabled={processing}
                      className="w-full py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50"
                    >
                      Ya transferí - Verificar pago
                    </button>
                  </div>
                </div>
              </div>
              )}

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Zap className="w-6 h-6 text-accent-cyan mx-auto mb-2" />
                  <p className="text-xs text-muted">Pago rápido</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-muted">Pago seguro</p>
                </div>
                <div className="text-center">
                  <Mail className="w-6 h-6 text-accent-violet mx-auto mb-2" />
                  <p className="text-xs text-muted">Contenido por email</p>
                </div>
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