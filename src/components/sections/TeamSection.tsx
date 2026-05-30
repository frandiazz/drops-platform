import { memo } from 'react';

const members = [
  { name: 'Franco Méndez', role: 'CEO & Fundador', color: 'from-accent-violet to-accent-cyan' },
  { name: 'Luciana Rivas', role: 'Head de Marketing', color: 'from-accent-cyan to-green-400' },
  { name: 'Tomás Paz', role: 'CTO', color: 'from-pink-500 to-accent-violet' },
  { name: 'Sofía Herrera', role: 'Legal & Ops', color: 'from-amber-500 to-accent-cyan' },
];

const TeamSection = memo(function TeamSection() {
  return (
    <section className="py-24 relative" aria-labelledby="about-heading">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-violet/5 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 section-fade">
          <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Equipo</span>
          <h2 id="about-heading" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold">
            Quiénes están detrás de <span className="gradient-text">Drops</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center section-fade">
          <div className="space-y-5">
            <p className="text-muted leading-relaxed">Drops nació en 2024 con una misión clara: que los creadores de contenido y modelos de IA puedan monetizar su trabajo sin fricción, sin comisiones abusivas y sin perder horas en procesos administrativos.</p>
            <p className="text-muted leading-relaxed">Somos un equipo de desarrolladores, expertos en marketing digital y legales que entienden el ecosistema creator economy. No somos una plataforma más — somos el partner que escala tu carrera.</p>
            <p className="text-muted leading-relaxed">Hoy trabajamos con +500 creadores activos en Latinoamérica y generamos más de $2M en ventas. Y recién empezamos.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {members.map((member, i) => (
              <div key={i} className="glass-card rounded-xl p-5 text-center hover:border-accent-violet/30">
                <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center mb-3`}>
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                </div>
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-[11px] text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default TeamSection;
