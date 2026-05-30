import { memo } from 'react';

const ServicesSection = memo(function ServicesSection() {
  const services = [
    { icon: 'chart', title: 'Gestión y Crecimiento Orgánico', desc: 'Administramos tus cuentas de TikTok, Instagram y X con estrategias probadas. Optimizamos el algoritmo para que cada publicación alcance su máximo potencial viral.', color: 'text-accent-violet' },
    { icon: 'zap', title: 'Plataforma Express Fricción Cero', desc: 'Tus fans compran con un solo click. Solo necesitan tarjeta y email. Sin contraseñas ni registros. El contenido se entrega automáticamente al confirmar el pago.', color: 'text-accent-cyan', id: 'friccion-cero' },
    { icon: 'shield', title: 'Asesoramiento Legal y Chatter', desc: 'Gestión profesional de comunidad, protección contra contracargos y fraude, soporte continuo 24/7 y asesoramiento legal completo.', color: 'text-green-400' },
  ];

  const icons: Record<string, React.ReactNode> = {
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
    zap: <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  };

  return (
    <section id="servicios" className="py-24 relative" aria-labelledby="services-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/5 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 section-fade">
          <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Servicios</span>
          <h2 id="services-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Todo lo que <span className="gradient-text">Drops</span> hace por tu carrera
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <article key={i} className={`glass-card rounded-2xl p-8 section-fade${service.id ? ' id-' + service.id : ''}`} id={service.id || undefined}>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 flex items-center justify-center mb-6">
                <svg className={`w-7 h-7 ${service.color}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  {icons[service.icon]}
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-muted leading-relaxed text-sm">{service.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ServicesSection;
