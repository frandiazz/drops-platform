'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [fans, setFans] = useState(1000);
  const [price, setPrice] = useState(25);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const gross = fans * price;
  const net = Math.round(gross * 0.80);

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

    return () => observer.disconnect();
  }, []);

  const faqs = [
    { q: '¿Cómo recibo el contenido después de pagar?', a: 'Al instante. Cuando completás el pago, te redirigimos automáticamente a una página con todo el contenido listo para ver o descargar. No hace falta que pongas tu email ni esperes ningún mensaje. El link de acceso es único y seguro.' },
    { q: '¿Es seguro poner los datos de mi tarjeta?', a: 'Sí. Todo el procesamiento de pagos lo hace Mercado Pago, la plataforma líder en Latinoamérica con más de 20 años de trayectoria. Los datos de tu tarjeta se tokenizan directamente desde tu navegador, nunca pasan por nuestros servidores.' },
    { q: '¿Puedo pedir un reembolso si no me gusta el contenido?', a: 'Si no recibís el acceso o hay un error técnico, contactanos a DropsDrops2005@gmail.com y lo resolvemos. Cada creador establece su propia política de reembolso, consultá directamente con él/ella.' },
    { q: '¿Cuánto cobra Drops de comisión?', a: 'Depende del servicio que elijas: Full Management (50%), Social Media Only (30%), Solo Plataforma (20%, puede bajar a 10% por volumen). Esto incluye gestión de redes, sistema de cobro express, protección antifraude y soporte continuo.' },
    { q: '¿Cómo y cuándo me pagan?', a: 'Los pagos se procesan y acreditan entre 24 y 48 horas después de solicitar el retiro. Podés retirar tus ganancias mediante transferencia bancaria, criptomonedas (USDT TRC20) o Mercado Pago. El mínimo de retiro es de $50 USD.' },
    { q: '¿Necesito un mínimo de seguidores para unirme?', a: 'No exigimos un mínimo de seguidores. Evaluamos cada caso individualmente. Si tenés contenido de calidad y compromiso para crecer, Drops te ayuda a escalar desde donde estés.' },
    { q: '¿Es seguro para mi contenido?', a: 'Absolutamente. Tu contenido se entrega mediante enlaces encriptados temporales que expiran después de la compra. Además, contamos con sistema DMCA activo y protección contra piratería. Importante: si la entrega se realiza por fuera de la app, Drops no se hace responsable.' },
    { q: '¿Puedo irme cuando quiera?', a: 'Sí, no hay contratos de permanencia. Podés cancelar tu cuenta en cualquier momento. Tus ganancias pendientes se te pagan en el siguiente ciclo de pago. Creemos en quedarnos porque generamos valor, no por obligación contractual.' },
  ];

  return (
    <>
      <Header />

      <main id="main-content">
        {/* HERO */}
        <section id="inicio" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-[120px] pulse-glow pointer-events-none" aria-hidden="true"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/8 rounded-full blur-[100px] pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} aria-hidden="true"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  Maximizamos tus ingresos de forma
                  <span className="gradient-text"> inteligente.</span><br />
                  <span className="text-white">Vos enfocate en crear.</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  La agencia de management definitiva para modelos de IA y creadores. Escalamos tu viralidad en redes y monetizamos tu contenido con nuestra plataforma de cobro express sin registros.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="/unite" className="px-8 py-4 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 text-center">
                    Empezar Ahora
                  </a>
                  <a href="#como-funciona" className="px-8 py-4 btn-cyan-outline font-bold rounded-xl text-center">
                    Ver cómo funciona
                  </a>
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
                      <div className="h-10 rounded-lg bg-dark-light/80 border border-slate-700/50 flex items-center px-3 text-sm text-muted">tu@email.com</div>
                      <div className="h-10 rounded-lg bg-dark-light/80 border border-slate-700/50 flex items-center px-3 text-sm text-muted">**** **** **** 4242</div>
                    </div>
                    <button className="w-full py-3 bg-accent-violet rounded-lg font-semibold text-sm neon-glow">Pagar en 10 segundos</button>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted">
                      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                      Sin registro. Contenido entregado al instante.
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-lg font-bold text-accent-cyan">$4.2K</p><p className="text-[10px] text-muted uppercase tracking-wider">Hoy</p></div>
                    <div><p className="text-lg font-bold text-accent-violet">187</p><p className="text-[10px] text-muted uppercase tracking-wider">Ventas</p></div>
                    <div><p className="text-lg font-bold text-green-400">98%</p><p className="text-[10px] text-muted uppercase tracking-wider">Éxito</p></div>
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
              {[
                { value: '+500', label: 'Creadores Activos', color: 'text-accent-cyan' },
                { value: '$2M+', label: 'Generados en Ventas', color: 'gradient-text' },
                { value: '10s', label: 'Checkout Promedio', color: 'text-accent-violet' },
                { value: '98%', label: 'Satisfacción', color: 'text-green-400' },
              ].map((stat, i) => (
                <div key={i} className="section-fade">
                  <p className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="py-24 relative" aria-labelledby="services-heading">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/5 to-transparent pointer-events-none" aria-hidden="true"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 section-fade">
              <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Servicios</span>
              <h2 id="services-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Todo lo que <span className="gradient-text">Drops</span> hace por tu carrera
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'chart', title: 'Gestión y Crecimiento Orgánico', desc: 'Administramos tus cuentas de TikTok, Instagram y X con estrategias probadas. Optimizamos el algoritmo para que cada publicación alcance su máximo potencial viral.', color: 'text-accent-violet' },
                { icon: 'zap', title: 'Plataforma Express Fricción Cero', desc: 'Tus fans compran con un solo click. Solo necesitan tarjeta y email. Sin contraseñas ni registros. El contenido se entrega automáticamente al confirmar el pago.', color: 'text-accent-cyan', id: 'friccion-cero' },
                { icon: 'shield', title: 'Asesoramiento Legal y Chatter', desc: 'Gestión profesional de comunidad, protección contra contracargos y fraude, soporte continuo 24/7 y asesoramiento legal completo.', color: 'text-green-400' },
              ].map((service, i) => (
                <article key={i} className={`glass-card rounded-2xl p-8 section-fade${service.id ? ' id-' + service.id : ''}`} id={service.id || undefined}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mb-6`}>
                    {service.icon === 'chart' && <svg className={`w-7 h-7 ${service.color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>}
                    {service.icon === 'zap' && <svg className={`w-7 h-7 ${service.color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                    {service.icon === 'shield' && <svg className={`w-7 h-7 ${service.color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted leading-relaxed text-sm">{service.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

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
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <p className="text-sm text-muted mb-2">Ingreso mensual estimado</p>
                  <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-cyan">${formatNumber(gross)}</span>
                  <p className="mt-4 text-xs text-muted">* Basado en una conversión del 80% después de la comisión de Drops (20%).</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted">
                    <svg className="w-4 h-4 text-accent-violet" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                    Tu ganancia neta: <span className="text-green-400 font-semibold">${formatNumber(net)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section id="como-funciona" className="py-24 relative" aria-labelledby="steps-heading">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/5 to-transparent pointer-events-none" aria-hidden="true"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 section-fade">
              <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Proceso</span>
              <h2 id="steps-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Tu camino al éxito en <span className="gradient-text">4 pasos</span>
              </h2>
            </div>

            <div className="relative">
              <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 step-line" aria-hidden="true"></div>

              <div className="space-y-12 md:space-y-16">
                {[
                  { n: 1, title: 'Registro y Verificación KYC', desc: 'Te registrás en Drops y verificás tu identidad de forma segura. Nuestro proceso KYC protege a toda la comunidad.', color: 'bg-accent-violet', shadow: 'shadow-violet-500/30' },
                  { n: 2, title: 'Auditoría y Gestión de Redes', desc: 'Nuestro equipo de marketing audita tus perfiles y comienza a administrar tus redes para maximizar tu viralidad.', color: 'bg-gradient-to-br from-accent-violet to-accent-cyan', shadow: 'shadow-cyan-500/20' },
                  { n: 3, title: 'Subí tu Contenido y Generá Links', desc: 'Subís tus packs de contenido exclusivo a tu panel y generás links de cobro express únicos para tu audiencia.', color: 'bg-gradient-to-br from-accent-cyan to-green-400', shadow: 'shadow-green-500/20' },
                  { n: 4, title: 'Cobros Automáticos y Retiro', desc: 'Tus fans compran en un click, el contenido se entrega al instante mediante enlaces encriptados, y vos retirás tus ganancias.', color: 'bg-green-400', shadow: 'shadow-green-500/30' },
                ].map((step) => (
                  <div key={step.n} className="flex flex-col md:flex-row md:items-start gap-6 section-fade">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-2xl font-bold relative z-10 shadow-lg ${step.shadow}`} aria-hidden="true">{step.n}</div>
                    <div className="glass-card rounded-xl p-6 flex-1">
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMPARATIVA */}
        <section className="py-24 relative" aria-labelledby="compare-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 section-fade">
              <span className="text-accent-violet text-sm font-semibold uppercase tracking-widest">Comparativa</span>
              <h2 id="compare-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                <span className="gradient-text">Con Drops</span> vs Sin Drops
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card rounded-2xl p-8 section-fade border-accent-violet/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-accent-violet flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-accent-violet">Con Drops</h3>
                </div>
                <ul className="space-y-4">
                  {['Checkout en 10 segundos sin registro', 'Gestión profesional de redes sociales', 'Protección antifraude y contracargos', 'Entrega automática de contenido', 'Soporte y asesoramiento legal 24/7'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                      <span className="text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-8 section-fade">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                    <svg className="w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </div>
                  <h3 className="text-xl font-bold text-muted">Sin Drops</h3>
                </div>
                <ul className="space-y-4">
                  {['Proceso de pago largo con registro obligatorio', 'Gestión manual sin estrategia de viralidad', 'Sin protección contra fraude ni contracargos', 'Entrega manual de contenido', 'Sin soporte legal ni asesoramiento'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      <span className="text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-24 relative" aria-labelledby="testimonials-heading">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/5 to-transparent pointer-events-none" aria-hidden="true"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 section-fade">
              <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Testimonios</span>
              <h2 id="testimonials-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Lo que dicen nuestros <span className="gradient-text">creadores</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: 'Valentina López', role: 'Modelo IA · Instagram + TikTok', initials: 'VL', gradient: 'from-accent-violet to-accent-cyan', text: 'En 3 meses tripliqué mis ingresos. El checkout express es una locura, mis fans compran sin pensarlo dos veces.' },
                { name: 'Martín Rodríguez', role: 'Creador de Contenido · TikTok + X', initials: 'MR', gradient: 'from-accent-cyan to-green-400', text: 'Pasé de 5K a 80K seguidores en 4 meses y el equipo de chatter maneja todo mientras yo solo creo contenido.' },
                { name: 'Camila Fernández', role: 'Modelo IA · Instagram', initials: 'CF', gradient: 'from-pink-500 to-accent-violet', text: 'Cero problemas con contracargos desde que estoy con Drops. El equipo legal se encarga de todo y yo retiro tranquila.' },
              ].map((t, i) => (
                <article key={i} className="glass-card rounded-2xl p-8 section-fade">
                  <div className="flex items-center gap-1 mb-4" aria-label="5 estrellas">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-muted text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold`}>{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted">{t.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SEGURIDAD */}
        <section id="seguridad" className="py-24 relative" aria-labelledby="security-heading">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 section-fade">
              <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Seguridad</span>
              <h2 id="security-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Tu dinero y tu identidad, <span className="gradient-text">100% protegidos</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'alert', title: 'Protección Antifraude', desc: 'Control estricto de contracargos y sistemas avanzados de detección de fraude en tiempo real.', color: 'text-red-400', bg: 'bg-red-500/10' },
                { icon: 'doc', title: 'Contratos Digitales Claros', desc: 'Términos y Condiciones transparentes que definen responsabilidades. Todo documentado y accesible.', color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
                { icon: 'lock', title: 'Entrega Encriptada', desc: 'Sistema automático de entrega mediante enlaces encriptados temporales. Solo el comprador autorizado accede.', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
              ].map((item, i) => (
                <article key={i} className="glass-card rounded-2xl p-8 text-center section-fade">
                  <div className={`w-16 h-16 mx-auto rounded-full ${item.bg} flex items-center justify-center mb-5`}>
                    {item.icon === 'alert' && <svg className={`w-8 h-8 ${item.color}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>}
                    {item.icon === 'doc' && <svg className={`w-8 h-8 ${item.color}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>}
                    {item.icon === 'lock' && <svg className={`w-8 h-8 ${item.color}`} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 relative" aria-labelledby="faq-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 section-fade">
              <span className="text-accent-violet text-sm font-semibold uppercase tracking-widest">FAQ</span>
              <h2 id="faq-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Preguntas <span className="gradient-text">frecuentes</span>
              </h2>
            </div>

            <div className="space-y-4 section-fade">
              {faqs.map((faq, i) => (
                <div key={i} className="faq-item glass-card rounded-xl overflow-hidden">
                  <button
                    className="faq-toggle w-full flex items-center justify-between p-6 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="text-base font-semibold pr-4">{faq.q}</span>
                    <span className={`faq-icon text-accent-cyan text-2xl font-light flex-shrink-0${openFaq === i ? ' rotate' : ''}`} aria-hidden="true">+</span>
                  </button>
                  <div className={`faq-answer px-6${openFaq === i ? ' open' : ''}`}>
                    <p className="text-muted text-sm leading-relaxed pb-6">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL / POSTULACIÓN */}
        <section id="postularme" className="py-24 relative" aria-labelledby="cta-heading">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-violet/10 via-transparent to-accent-cyan/10 pointer-events-none" aria-hidden="true"></div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="section-fade">
              <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6">
                ¿Listo para <span className="gradient-text">escalar</span> tu carrera?
              </h2>
              <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
                Unite a Drops hoy y empezá a monetizar tu contenido como un profesional. Sin complicaciones, sin esperas.
              </p>
              <a href="/apply" className="w-full sm:inline-flex items-center justify-center px-10 py-4 bg-accent-violet text-white text-lg font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300">
                Quiero Management
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
