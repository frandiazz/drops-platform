import { memo } from 'react';

const testimonials = [
  { name: 'Valentina López', role: 'Modelo IA · Instagram + TikTok', location: 'Buenos Aires, Argentina', gradient: 'from-accent-violet to-accent-cyan', text: 'Pasé de $0 a $4.2K/mes en 3 meses. El checkout express es una locura, mis fans compran sin pensarlo dos veces.' },
  { name: 'Martín Rodríguez', role: 'Creador de Contenido · TikTok + X', location: 'Bogotá, Colombia', gradient: 'from-accent-cyan to-green-400', text: 'Pasé de 5K a 80K seguidores en 4 meses. El equipo de chatter maneja las interacciones mientras yo solo creo contenido.' },
  { name: 'Camila Fernández', role: 'Modelo IA · Instagram', location: 'Santiago, Chile', gradient: 'from-pink-500 to-accent-violet', text: 'Cero chargebacks en 6 meses desde que estoy con Drops. El equipo legal se encarga de todo y yo retiro tranquila.' },
];

function StarIcon() {
  return <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
}

const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="py-24 relative" aria-labelledby="testimonials-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/5 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 section-fade">
          <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Testimonios</span>
          <h2 id="testimonials-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Lo que dicen nuestros <span className="gradient-text">creadores</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <article key={i} className="glass-card rounded-2xl p-8 section-fade">
              <div className="flex items-center gap-1 mb-4" aria-label="5 estrellas">
                {[...Array(5)].map((_, j) => <StarIcon key={j} />)}
              </div>
              <p className="text-muted text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                  <p className="text-[10px] text-slate-600">{t.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TestimonialsSection;
