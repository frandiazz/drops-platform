import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CreditCard, Wallet, DollarSign, Zap, Shield, Mail, ArrowRight, Check } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Volver
          </Link>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Product Info */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <div className="aspect-square rounded-xl bg-dark-light/50 border border-slate-700/50 flex items-center justify-center mb-6">
                  <span className="text-6xl">📦</span>
                </div>
                <h2 className="text-xl font-bold mb-2">Premium Content Pack</h2>
                <p className="text-muted text-sm mb-4">Contenido exclusivo de alta calidad. Acceso inmediato después del pago.</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-accent-cyan">$29.99</span>
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
                    <span>Contenido encriptado</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                  Checkout <span className="gradient-text">Express</span>
                </h1>
                <p className="text-muted">Solo necesitás tu email y método de pago. Sin registros, sin contraseñas.</p>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-4 mb-8">
                {[
                  { n: 1, label: 'Tu email', done: true },
                  { n: 2, label: 'Método de pago', done: false },
                  { n: 3, label: 'Recibir contenido', done: false },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.done ? 'bg-accent-violet text-white' : 'bg-dark-light border border-slate-700 text-muted'}`}>
                      {step.n}
                    </div>
                    <span className={`text-xs hidden sm:inline ${step.done ? 'text-white' : 'text-muted'}`}>{step.label}</span>
                    {i < 2 && <div className="flex-1 h-px bg-slate-700/50"></div>}
                  </div>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <h3 className="text-lg font-bold mb-6">Elegí tu método de pago</h3>

                <div className="space-y-4">
                  {/* Takenos - Card */}
                  <a
                    href="https://app.takenos.com/pay/a1b71309-95c7-4b50-9e65-e614f29a79cb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-dark-light/30 hover:border-accent-violet/50 hover:bg-dark-light/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent-violet/10 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-accent-violet" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Tarjeta de crédito o débito</p>
                      <p className="text-xs text-muted">Pago internacional en USD · Procesado por Takenos</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent-cyan transition-colors flex-shrink-0" />
                  </a>

                  {/* Mercado Pago */}
                  <a
                    href="https://mpago.la/1jztdtA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-700/50 bg-dark-light/30 hover:border-accent-violet/50 hover:bg-dark-light/50 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Mercado Pago</p>
                      <p className="text-xs text-muted">Pagos en pesos argentinos</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted group-hover:text-accent-cyan transition-colors flex-shrink-0" />
                  </a>

                  {/* Crypto */}
                  <div className="p-4 rounded-xl border border-slate-700/50 bg-dark-light/30">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Criptomonedas (USDT TRC20)</p>
                        <p className="text-xs text-muted">Envía el monto exacto a esta dirección</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-dark/50 border border-slate-700/50">
                      <code className="flex-1 text-xs text-accent-cyan break-all">TBLGXxTTmKDhisVYwqmZR9dH57TWUpoNUB</code>
                      <button
                        onClick={() => navigator.clipboard.writeText('TBLGXxTTmKDhisVYwqmZR9dH57TWUpoNUB')}
                        className="px-3 py-1.5 bg-accent-violet/20 text-accent-violet rounded text-xs font-medium hover:bg-accent-violet/30 transition-colors flex-shrink-0"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>

                  {/* Bank Transfer */}
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
                    <div className="space-y-2 text-xs">
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
                      <div className="flex justify-between p-2 rounded bg-dark/50">
                        <span className="text-muted">Tipo:</span>
                        <span className="text-white font-medium">Personal checking</span>
                      </div>
                      <div className="p-2 rounded bg-dark/50">
                        <span className="text-muted">Banco:</span>
                        <span className="text-white font-medium block mt-1">Lead Bank, 1801 Main St., Kansas City, MO, 64108</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Zap className="w-6 h-6 text-accent-cyan mx-auto mb-2" />
                  <p className="text-xs text-muted">Pago en 10 segundos</p>
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
