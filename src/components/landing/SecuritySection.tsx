const items = [
  { icon: 'alert', title: 'Protección Antifraude', desc: 'Control estricto de contracargos y sistemas avanzados de detección de fraude en tiempo real.', color: 'text-red-400', bg: 'bg-red-500/10' },
  { icon: 'doc', title: 'Contratos Digitales Claros', desc: 'Términos y Condiciones transparentes que definen responsabilidades. Todo documentado y accesible.', color: 'text-accent-violet', bg: 'bg-accent-violet/10' },
  { icon: 'lock', title: 'Entrega Encriptada', desc: 'Sistema automático de entrega mediante enlaces encriptados temporales. Solo el comprador autorizado accede.', color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
];

export default function SecuritySection() {
  return (
    <section id="seguridad" className="py-24 relative" aria-labelledby="security-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 section-fade">
          <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Seguridad</span>
          <h2 id="security-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Tu dinero y tu identidad, <span className="gradient-text">100% protegidos</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
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
  );
}
