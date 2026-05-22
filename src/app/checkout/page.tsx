'use client';

import { useState, Suspense, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Zap, Shield, Mail, Check, Loader2, AlertCircle } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [saleResult, setSaleResult] = useState<any>(null);

  const packTitle = searchParams.get('title') || 'Premium Content Pack';
  const packPrice = searchParams.get('price') || '29.99';
  const creatorName = searchParams.get('creator') || 'Creador';
  const creatorId = searchParams.get('creatorId') || '';
  const packId = searchParams.get('packId') || '';

  const handleCardPayment = async () => {
    if (!email) { setError('Ingresá tu email'); return; }
    if (!creatorId || !packId) { setError('Error: datos incompletos'); return; }

    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(packPrice),
          buyer_email: email,
          creator_id: creatorId,
          content_id: packId,
          title: packTitle,
        }),
      });

      const data = await res.json();

      if (data.init_point) {
        setSaleResult(data);
        window.location.href = data.init_point;
      } else {
        setError(data.error || 'Error al crear el pago');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setProcessing(false);
    }
  };

  if (saleResult) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Redirigiendo al pago...</h1>
            <p className="text-muted text-sm mb-6">Completá el pago en la ventana de Mercado Pago.</p>
            {saleResult.access_token && (
              <p className="text-xs text-muted">
                Si no se abre automáticamente, guardá este link: <br />
                <code className="text-accent-cyan">{window.location.origin}/acceder/{saleResult.access_token}</code>
              </p>
            )}
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
                <p className="text-muted text-sm mb-4">Contenido exclusivo de alta calidad.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-accent-cyan">${packPrice}</span>
                  <span className="text-xs text-muted">USD</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Acceso inmediato</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Sin registro necesario</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Pago seguro vía Mercado Pago</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Checkout <span className="gradient-text">Express</span></h1>
                <p className="text-muted">Pagá con tarjeta al instante. Sin registros.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold mb-4">1. Tu email</h3>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted flex-shrink-0" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com"
                    className="flex-1 h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                <h3 className="text-lg font-bold mb-4">2. Pagá con tarjeta</h3>
                <p className="text-xs text-muted mb-4">Total: <span className="text-white font-bold">${packPrice} USD</span></p>

                <button
                  onClick={handleCardPayment}
                  disabled={processing}
                  className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
                >
                  {processing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                  ) : (
                    <><CreditCard className="w-5 h-5" /> Pagar ${packPrice} USD</>
                  )}
                </button>
                <p className="text-xs text-muted text-center mt-3">Serás redirigido a Mercado Pago para completar el pago de forma segura.</p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center"><Zap className="w-6 h-6 text-accent-cyan mx-auto mb-2" /><p className="text-xs text-muted">Pago express</p></div>
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
