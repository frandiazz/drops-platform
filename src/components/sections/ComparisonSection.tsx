import { memo } from 'react';

const pros = ['Checkout en 10 segundos sin registro', 'Gestión profesional de redes sociales', 'Protección antifraude y contracargos', 'Entrega automática de contenido', 'Soporte y asesoramiento legal 24/7'];
const cons = ['Proceso de pago largo con registro obligatorio', 'Gestión manual sin estrategia de viralidad', 'Sin protección contra fraude ni contracargos', 'Entrega manual de contenido', 'Sin soporte legal ni asesoramiento'];

function CheckIcon({ className }: { className?: string }) {
  return <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
}

function XIcon({ className }: { className?: string }) {
  return <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
}

const ComparisonSection = memo(function ComparisonSection() {
  return (
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
                <CheckIcon className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-accent-violet">Con Drops</h3>
            </div>
            <ul className="space-y-4">
              {pros.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckIcon className="text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-8 section-fade">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <XIcon className="text-muted" />
              </div>
              <h3 className="text-xl font-bold text-muted">Sin Drops</h3>
            </div>
            <ul className="space-y-4">
              {cons.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <XIcon className="text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
});

export default ComparisonSection;
