const steps = [
  { n: 1, title: 'Registro y Verificación KYC', desc: 'Te registrás en Drops y verificás tu identidad de forma segura. Nuestro proceso KYC protege a toda la comunidad.', color: 'bg-accent-violet', shadow: 'shadow-violet-500/30' },
  { n: 2, title: 'Auditoría y Gestión de Redes', desc: 'Nuestro equipo de marketing audita tus perfiles y comienza a administrar tus redes para maximizar tu viralidad.', color: 'bg-gradient-to-br from-accent-violet to-accent-cyan', shadow: 'shadow-cyan-500/20' },
  { n: 3, title: 'Subí tu Contenido y Generá Links', desc: 'Subís tus packs de contenido exclusivo a tu panel y generás links de cobro express únicos para tu audiencia.', color: 'bg-gradient-to-br from-accent-cyan to-green-400', shadow: 'shadow-green-500/20' },
  { n: 4, title: 'Cobros Automáticos y Retiro', desc: 'Tus fans compran en un click, el contenido se entrega al instante mediante enlaces encriptados, y vos retirás tus ganancias.', color: 'bg-green-400', shadow: 'shadow-green-500/30' },
];

export default function StepsSection() {
  return (
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
            {steps.map((step) => (
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
  );
}
