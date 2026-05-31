'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';

const ServicesSection = dynamic(() => import('@/components/sections/ServicesSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection'), { ssr: false });
const ComparisonSection = dynamic(() => import('@/components/sections/ComparisonSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'), { ssr: false });
const TeamSection = dynamic(() => import('@/components/sections/TeamSection'), { ssr: false });
const SecuritySection = dynamic(() => import('@/components/sections/SecuritySection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: false });
const CTASection = dynamic(() => import('@/components/sections/CTASection'), { ssr: false });

const creators = [
  'Sofía', 'Martín', 'Camila', 'Julián', 'Valentina', 'Tomás', 'Lucía', 'Felipe', 'Agustina', 'Mateo',
  'Isabella', 'Santiago', 'Emilia', 'Benjamín', 'Catalina', 'Sebastián', 'Micaela', 'Nicolás', 'Renata', 'Bruno',
];

function LiveTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % creators.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-3 bg-accent-violet/5 border-y border-accent-violet/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-400 font-semibold">En vivo</span>
        </span>
        <span className="hidden sm:inline">&mdash;</span>
        <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">{creators[index]}</span>
        <span>se unió a Drops</span>
        <span className="text-[11px] text-slate-500">hace minutos</span>
      </div>
    </div>
  );
}

function StatCard({ target, prefix = '', suffix = '', label, color }: { target: number; prefix?: string; suffix?: string; label: string; color: string }) {
  const { ref, display, visible } = useAnimatedCounter(target, 2500, prefix, suffix);
  return (
    <div ref={ref} className="section-fade">
      <p className={`text-3xl sm:text-4xl font-black ${color}${visible ? '' : ' opacity-0'}`}>{visible ? display : `${prefix}0${suffix}`}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  const [fans, setFans] = useState(1000);
  const [price, setPrice] = useState(25);
  const [plan, setPlan] = useState<'solo' | 'social' | 'full'>('solo');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const gross = fans * price;
  const rates = { solo: 0.8, social: 0.7, full: 0.5 };
  const net = Math.round(gross * rates[plan]);

  const formatNumber = (n: number) => n.toLocaleString('es-AR');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.section-fade').forEach((el) => observer.observe(el));

    const fallback = setTimeout(() => {
      document.querySelectorAll('.section-fade').forEach((el) => el.classList.add('visible'));
    }, 4000);

    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, []);

  return (
    <>
      <Header />

      <main id="main-content">
        {/* HERO */}
        <section id="inicio" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent-violet/10 rounded-full blur-[80px] pulse-glow pointer-events-none max-md:hidden" aria-hidden="true"></div>
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-accent-cyan/8 rounded-full blur-[60px] pulse-glow pointer-events-none max-md:hidden" style={{ animationDelay: '1.5s' }} aria-hidden="true"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  Maximizamos tus ingresos de forma
                  <span className="gradient-text"> inteligente.</span><br />
                  <span className="text-white">Vos enfocate en crear.</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  La plataforma de monetización y management para creadores de contenido. Escalamos tu alcance en redes y potenciamos tus ingresos con pagos express, sin vueltas.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="/unite" className="px-8 py-4 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 text-center">
                    Empezar Ahora
                  </a>
                  <a href="#como-funciona" className="px-8 py-4 btn-cyan-outline font-bold rounded-xl text-center">
                    Ver cómo funciona
                  </a>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    Pagos 100% seguros por <span className="text-blue-400 font-semibold">Mercado Pago</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <span className="text-green-400 font-semibold">+500</span> creadores activos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Protección DMCA activa
                  </span>
                </div>
              </div>

              <div className="animate-float" aria-hidden="true">
                <div className="hero-mockup rounded-2xl p-6 max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs text-muted">drops.checkout/express</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-light/60 border border-slate-700/50">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-sm font-bold">P</div>
                      <div>
                        <p className="text-sm font-semibold">Premium Content Pack</p>
                        <p className="text-xs text-muted">Acceso inmediato</p>
                      </div>
                      <span className="ml-auto text-accent-cyan font-bold">$29.99</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-10 rounded-lg bg-dark-light/80 border border-slate-700/50 flex items-center px-3 text-sm text-muted">DNI 12345678</div>
                      <div className="h-10 rounded-lg bg-dark-light/80 border border-slate-700/50 flex items-center px-3 text-sm text-muted">**** **** **** 4242</div>
                    </div>
                    <button className="w-full py-3 bg-accent-violet rounded-lg font-semibold text-sm neon-glow">Pagar en 10 segundos</button>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                      Sin registro. Contenido entregado al instante.
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-lg font-bold text-accent-cyan">$4.2K</p><p className="text-xs text-muted uppercase tracking-wider">Hoy</p></div>
                    <div><p className="text-lg font-bold text-accent-violet">187</p><p className="text-xs text-muted uppercase tracking-wider">Ventas</p></div>
                    <div><p className="text-lg font-bold text-green-400">98%</p><p className="text-xs text-muted uppercase tracking-wider">Éxito</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-16 border-y border-slate-800/50 bg-dark-light/20" aria-label="Estadísticas de Drops">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard target={500} prefix="+" label="Creadores Activos" color="text-accent-cyan" />
              <StatCard target={2000000} prefix="$" suffix="+" label="Generados en Ventas" color="gradient-text" />
              <StatCard target={10} suffix="s" label="Checkout Promedio" color="text-accent-violet" />
              <StatCard target={98} suffix="%" label="Satisfacción" color="text-green-400" />
            </div>
          </div>
        </section>

        {/* LIVE SOCIAL PROOF */}
        <LiveTicker />

        <ServicesSection />

        {/* CALCULADORA */}
        <section id="calculadora" className="py-24 relative" aria-labelledby="calculator-heading">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent-cyan/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12 section-fade">
              <span className="text-accent-violet text-sm font-semibold uppercase tracking-widest">Calculadora</span>
              <h2 id="calculator-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Calculá cuánto podés <span className="gradient-text">ganar con Drops</span>
              </h2>
            </div>

            <div className="glass rounded-2xl p-8 sm:p-12 section-fade">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="fansRange" className="text-sm font-semibold text-muted">Número de Fans Estimados</label>
                      <span className="text-accent-cyan font-bold text-lg">{formatNumber(fans)}</span>
                    </div>
                    <input type="range" id="fansRange" min="100" max="10000" step="100" value={fans} onChange={(e) => setFans(Number(e.target.value))} aria-label="Seleccionar número de fans estimados" />
                    <div className="flex justify-between text-xs text-muted mt-2"><span>100</span><span>10,000</span></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label htmlFor="priceRange" className="text-sm font-semibold text-muted">Precio del Pack (USD)</label>
                      <span className="text-accent-violet font-bold text-lg">${price}</span>
                    </div>
                    <input type="range" id="priceRange" min="5" max="100" step="1" value={price} onChange={(e) => setPrice(Number(e.target.value))} aria-label="Seleccionar precio del pack en dólares" />
                    <div className="flex justify-between text-xs text-muted mt-2"><span>$5</span><span>$100</span></div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-muted block mb-3">Plan</label>
                    <div className="flex gap-2">
                      {[
                        { key: 'solo' as const, label: 'Solo Plataforma', comm: '20%' },
                        { key: 'social' as const, label: 'Social Media', comm: '30%' },
                        { key: 'full' as const, label: 'Full Management', comm: '50%' },
                      ].map(p => (
                        <button key={p.key} onClick={() => setPlan(p.key)}
                          className={`flex-1 h-12 text-xs font-semibold rounded-lg border transition-colors ${plan === p.key ? 'border-accent-violet bg-accent-violet/10 text-accent-violet' : 'border-slate-700/50 bg-dark-light/50 text-muted hover:border-slate-600'}`}>
                          {p.label}<br /><span className="text-[10px]">{p.comm}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted mb-2">Ingreso mensual estimado</p>
                  <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-cyan">${formatNumber(gross)}</span>
                  <p className="mt-4 text-xs text-muted">* Basado en una comisión de Drops del {plan === 'solo' ? '20%' : plan === 'social' ? '30%' : '50%'}.</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted">
                    <svg className="w-4 h-4 text-accent-violet" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                    Tu ganancia neta: <span className="text-green-400 font-semibold">${formatNumber(net)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="planes" className="py-24 relative" aria-labelledby="pricing-heading">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/5 to-transparent pointer-events-none" aria-hidden="true"></div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 section-fade">
              <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Planes</span>
              <h2 id="pricing-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Planes <span className="gradient-text">transparentes</span>, sin sorpresas
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  plan: 'solo',
                  name: 'Solo Plataforma',
                  tag: 'Empezá ya',
                  commission: '20%',
                  youKeep: '80%',
                  price: '$0',
                  priceLabel: 'por mes',
                  description: 'Usá Drops como tu plataforma de cobro express. Subí contenido, generá links y cobrá al instante.',
                  features: [
                    'Checkout express sin registro',
                    'Subí y vendé contenido ilimitado',
                    'Pagos por Mercado Pago',
                    'Enlaces encriptados temporales',
                    'Retiro 24-48hs',
                    'Soporte por email',
                  ],
                  cta: 'Crear Cuenta Gratis',
                  href: '/crear-cuenta',
                  popular: false,
                  border: 'border-slate-700/50',
                  accent: 'text-accent-cyan',
                  btn: 'bg-slate-800 border-slate-700/50 hover:bg-slate-700',
                },
                {
                  plan: 'social',
                  name: 'Social Media',
                  tag: 'Más vendido',
                  commission: '30%',
                  youKeep: '70%',
                  price: '$299',
                  priceLabel: '/mes',
                  description: 'Nos encargamos de tus redes. Estrategia, contenido y crecimiento orgánico para maximizar tu alcance.',
                  features: [
                    'Todo el plan Solo Plataforma',
                    'Gestión de Instagram + TikTok + X',
                    'Estrategia de contenido semanal',
                    'Optimización de perfiles',
                    'Chatter y comunidad',
                    'Soporte prioritario',
                  ],
                  cta: 'Postularme',
                  href: '/apply',
                  popular: true,
                  border: 'border-accent-violet/40',
                  accent: 'text-accent-violet',
                  btn: 'bg-accent-violet hover:bg-violet-600 neon-glow',
                },
                {
                  plan: 'full',
                  name: 'Full Management',
                  tag: 'Máximo crecimiento',
                  commission: '50%',
                  youKeep: '50%',
                  price: '$599',
                  priceLabel: '/mes',
                  description: 'El paquete completo. Management integral, legal, producción y estrategia 360° para escalar tu carrera.',
                  features: [
                    'Todo el plan Social Media',
                    'Asesoramiento legal integral',
                    'Protección antifraude y chargebacks',
                    'Producción de contenido',
                    'Gestión de marca personal',
                    'Soporte 24/7 dedicado',
                  ],
                  cta: 'Postularme',
                  href: '/apply',
                  popular: false,
                  border: 'border-slate-700/50',
                  accent: 'text-green-400',
                  btn: 'bg-slate-800 border-slate-700/50 hover:bg-slate-700',
                },
              ].map((p, i) => (
                <article key={i} className={`relative glass-card rounded-2xl p-8 section-fade flex flex-col ${p.popular ? 'border-accent-violet/40 scale-up' : p.border}`}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-violet rounded-full text-xs font-bold text-white shadow-lg">
                      Más Popular
                    </div>
                  )}
                  <div className="mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{p.tag}</span>
                    <h3 className="text-xl font-bold mt-1">{p.name}</h3>
                  </div>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-black">{p.price}</span>
                    <span className="text-sm text-muted ml-1">{p.priceLabel}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted">Comisión:</span>
                      <span className="text-sm font-bold">{p.commission}</span>
                      <span className="text-xs text-muted">(vos te quedás</span>
                      <span className={`text-sm font-bold ${p.accent}`}>{p.youKeep}</span>
                      <span className="text-xs text-muted">)</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-6">{p.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted">
                        <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href={p.href} className={`w-full py-3.5 text-white text-sm font-bold rounded-xl transition-all duration-300 text-center ${p.btn}`}>
                    {p.cta}
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center section-fade">
              <p className="text-xs text-muted">
                Todos los planes incluyen protección DMCA, enlaces encriptados y sistema antifraude. 
                Sin contratos de permanencia · Cancelá cuando quieras.
              </p>
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <ComparisonSection />
        <TestimonialsSection />
        <TeamSection />
        <SecuritySection />
        <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
