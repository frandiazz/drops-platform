const stats = [
  { value: '+500', label: 'Creadores Activos', color: 'text-accent-cyan' },
  { value: '$2M+', label: 'Generados en Ventas', color: 'gradient-text' },
  { value: '10s', label: 'Checkout Promedio', color: 'text-accent-violet' },
  { value: '98%', label: 'Satisfacción', color: 'text-green-400' },
];

export default function StatsBar() {
  return (
    <section className="py-16 border-y border-slate-800/50 bg-dark-light/20" aria-label="Estadísticas de Drops">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="section-fade">
              <p className={`text-3xl sm:text-4xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
