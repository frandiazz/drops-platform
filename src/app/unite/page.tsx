'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles, Globe, CheckCircle } from 'lucide-react';

export default function UnitePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Unite a <span className="gradient-text">Drops</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Elegí el camino que mejor se adapte a tu carrera
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-8 flex flex-col border-accent-violet/30 hover:border-accent-violet/60 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mb-5">
                <Sparkles className="w-7 h-7 text-accent-violet" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Management Completo</h2>
              <p className="text-muted text-sm mb-6 leading-relaxed">
                Nos encargamos de todo: gestionamos tus redes, creamos estrategia de contenido, 
                optimizamos tu perfil y maximizamos tus ingresos. Seleccionamos personalmente 
                a cada creadora.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Gestión de Instagram, TikTok y X',
                  'Estrategia de contenido personalizada',
                  'Plataforma de cobro express incluida',
                  'Soporte y asesoramiento continuo',
                  'Selección exclusiva',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/apply"
                className="w-full py-4 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Postularme a Management
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="glass-card rounded-2xl p-8 flex flex-col hover:border-slate-600/50 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-green-400/20 flex items-center justify-center mb-5">
                <Globe className="w-7 h-7 text-accent-cyan" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Solo Plataforma</h2>
              <p className="text-muted text-sm mb-6 leading-relaxed">
                Usá Drops como tu plataforma de monetización. Subí tu contenido, generá 
                links de cobro express y recibí pagos al instante. Todo sin que nosotros 
                gestionemos tus redes.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Checkout express sin registro para tus fans',
                  'Subí y vendé tu contenido al instante',
                  'Cobrá por Mercado Pago en ARS',
                  'Retirá tus ganancias 24-48hs',
                  'Registro inmediato, sin revisión',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/crear-cuenta"
                className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all duration-300 flex items-center justify-center gap-2 border border-slate-700/50"
              >
                Crear Cuenta Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
