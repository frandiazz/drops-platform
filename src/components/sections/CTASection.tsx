import { memo } from 'react';

const CTASection = memo(function CTASection() {
  return (
    <section id="postularme" className="py-24 relative" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-violet/10 via-transparent to-accent-cyan/10 pointer-events-none" aria-hidden="true" />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Sin contrato de permanencia
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Cancelá cuando quieras
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Garantía: te asistimos si hay problema
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default CTASection;
