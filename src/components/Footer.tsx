import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-dark-light/30" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg className="w-7 h-7 text-accent-cyan" viewBox="0 0 32 40" fill="none" aria-hidden="true">
                <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropGrad2)"/>
                <defs><linearGradient id="dropGrad2" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
              </svg>
              <span className="text-lg font-bold">Drops</span>
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              La plataforma de monetización y management para creadores de contenido y modelos de IA. Maximizamos tus ingresos con tecnología de vanguardia.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="mailto:DropsDrops2005@gmail.com" className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-200" aria-label="Contacto por email">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Navegación</h4>
            <ul className="space-y-3">
              <li><Link href="/#inicio" className="block py-2 text-sm text-muted hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/#servicios" className="block py-2 text-sm text-muted hover:text-white transition-colors">Servicios</Link></li>
              <li><Link href="/#friccion-cero" className="block py-2 text-sm text-muted hover:text-white transition-colors">Fricción Cero</Link></li>
              <li><Link href="/#calculadora" className="block py-2 text-sm text-muted hover:text-white transition-colors">Calcular Ganancias</Link></li>
              <li><Link href="/#como-funciona" className="block py-2 text-sm text-muted hover:text-white transition-colors">Cómo Funciona</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/terminos" className="block py-2 text-sm text-muted hover:text-white transition-colors">Términos para Creadores</Link></li>
              <li><Link href="/privacidad" className="block py-2 text-sm text-muted hover:text-white transition-colors">Políticas de Privacidad</Link></li>
              <li><a href="mailto:DropsDrops2005@gmail.com?subject=DMCA" className="block py-2 text-sm text-muted hover:text-white transition-colors">Soporte DMCA</a></li>
              <li><a href="mailto:DropsDrops2005@gmail.com" className="block py-2 text-sm text-muted hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">&copy; 2026 Drops. Todos los derechos reservados.</p>
          <p className="text-xs text-muted">Hecho con tecnología de vanguardia para creadores.</p>
        </div>
      </div>
    </footer>
  );
}
