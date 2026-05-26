export default function HeroSection() {
  return (
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
  );
}
