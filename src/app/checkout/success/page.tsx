'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Mail, ArrowLeft, Download } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'tu email';
  const packTitle = searchParams.get('pack') || 'Premium Content Pack';
  const creatorName = searchParams.get('creator') || 'Creador';
  const price = searchParams.get('price') || '0';

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-8">
            <Check className="w-10 h-10 text-green-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            ¡Pago <span className="gradient-text">exitoso</span>!
          </h1>
          <p className="text-muted text-lg mb-2">
            Compraste <strong className="text-white">{packTitle}</strong> de <strong className="text-white">{creatorName}</strong>
          </p>
          <p className="text-muted mb-8">
            por <span className="text-accent-cyan font-bold">${price} USD</span>
          </p>

          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-accent-cyan" />
              <h3 className="text-lg font-bold">Contenido enviado a {email}</h3>
            </div>
            <p className="text-muted text-sm mb-6">
              Te enviamos un email con el link de acceso a tu contenido. Si no lo ves, revisá la carpeta de spam.
            </p>
            <p className="text-xs text-muted">
              Si tenés alguna duda, escribinos a DropsDrops2005@gmail.com
            </p>
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
