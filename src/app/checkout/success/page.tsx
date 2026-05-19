import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Check, Mail, ArrowLeft, Download } from 'lucide-react';

export default function PaymentSuccessPage() {
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
          <p className="text-muted text-lg mb-8">
            Tu compra fue procesada correctamente. Revisá tu email para acceder al contenido.
          </p>

          <div className="glass-card rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-accent-cyan" />
              <h3 className="text-lg font-bold">Contenido enviado</h3>
            </div>
            <p className="text-muted text-sm mb-6">
              Te enviamos un email con el link de acceso a tu contenido. Si no lo ves, revisá la carpeta de spam.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2">
                <Download className="w-5 h-5" />
                Descargar contenido
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-dark-light/50 border border-slate-700/50">
              <p className="text-sm text-muted">
                <strong className="text-white">¿No recibiste el email?</strong> Revisá spam o contactanos a DropsDrops2005@gmail.com
              </p>
            </div>
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
