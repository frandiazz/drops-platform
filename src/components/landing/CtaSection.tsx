export default function CtaSection() {
  return (
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
  );
}
