'use client';

import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, Zap, Shield, Mail, Check, Loader2, AlertCircle } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const packTitle = searchParams.get('title') || 'Premium Content Pack';
  const packPrice = searchParams.get('price') || '29.99';
  const creatorName = searchParams.get('creator') || 'Creador';
  const creatorId = searchParams.get('creatorId') || '';
  const packId = searchParams.get('packId') || '';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setError('Completá todos los campos');
      return;
    }
    if (!creatorId || !packId) {
      setError('Error: datos del producto');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/process-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(packPrice),
          buyer_email: email,
          creator_id: creatorId,
          content_id: packId,
          title: packTitle,
          card: {
            number: cardNumber.replace(/\s/g, ''),
            expiry: cardExpiry,
            cvv: cardCvv,
            name: cardName,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/acceder/${data.access_token}`);
      } else {
        setError(data.error || 'Pago rechazado');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setProcessing(false);
    }
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
                <p className="text-muted text-sm mb-4">Contenido exclusivo.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-accent-cyan">${packPrice}</span>
                  <span className="text-xs text-muted">USD</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Acceso inmediato</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Sin registro</span></div>
                  <div className="flex items-center gap-2 text-sm text-muted"><Check className="w-4 h-4 text-green-400" /><span>Pago seguro</span></div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Checkout <span className="gradient-text">Express</span></h1>
                <p className="text-muted">Pagá con tarjeta al instante. Sin salir de esta página.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-6">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                </div>
              )}

              <form onSubmit={handlePay}>
                <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                  <h3 className="text-lg font-bold mb-4">1. Email</h3>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="tu@email.com"
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
                </div>

                <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6">
                  <h3 className="text-lg font-bold mb-4">2. Datos de la tarjeta</h3>
                  <p className="text-xs text-muted mb-4">Total: <span className="text-white font-bold">${packPrice} USD</span></p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Número de tarjeta</label>
                      <input type="text" inputMode="numeric" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required
                        placeholder="5031 7557 3453 0604"
                        className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Vencimiento</label>
                        <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required
                          placeholder="11/25"
                          className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">CVV</label>
                        <input type="text" inputMode="numeric" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required
                          placeholder="123"
                          className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Titular</label>
                      <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} required
                        placeholder="Como figura en la tarjeta"
                        className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors" />
                    </div>
                  </div>

                  <button type="submit" disabled={processing}
                    className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-lg mt-6">
                    {processing ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                    ) : (
                      <><CreditCard className="w-5 h-5" /> Pagar ${packPrice} USD</>
                    )}
                  </button>
                </div>
              </form>

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
