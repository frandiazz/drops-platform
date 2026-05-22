'use client';

import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Mail, ArrowLeft, Clock } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'tu email';
  const packTitle = searchParams.get('pack') || 'Premium Content Pack';
  const creatorName = searchParams.get('creator') || 'Creador';
  const price = searchParams.get('price') || '0';
  const saleId = searchParams.get('saleId') || '';

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-8">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Compra <span className="gradient-text">registrada</span>
          </h1>
          <p className="text-muted text-lg mb-2">
            <strong className="text-white">{packTitle}</strong> de <strong className="text-white">{creatorName}</strong>
          </p>
          <p className="text-muted mb-6">
            por <span className="text-accent-cyan font-bold">${price} USD</span>
          </p>

          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-bold">Pendiente de verificación</h3>
            </div>
            <p className="text-muted text-sm mb-4">
              Estamos verificando tu pago. El contenido se te enviará a <strong className="text-white">{email}</strong> una vez confirmado.
            </p>
            {saleId && (
              <p className="text-xs text-muted mb-4">
                ID de compra: <code className="text-accent-cyan">{saleId}</code>
              </p>
            )}
            <div className="p-4 rounded-lg bg-dark-light/50 border border-slate-700/50">
              <p className="text-sm text-muted">
                <strong className="text-white">¿No te llega nada?</strong> Escribinos a DropsDrops2005@gmail.com con tu ID de compra.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}