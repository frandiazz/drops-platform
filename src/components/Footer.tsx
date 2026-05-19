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
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-200" aria-label="Seguinos en X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-accent-violet hover:border-accent-violet/30 transition-all duration-200" aria-label="Seguinos en Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-200" aria-label="Seguinos en TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.78V6.69h3.77z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Navegación</h4>
            <ul className="space-y-3">
              <li><a href="#inicio" className="text-sm text-muted hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#servicios" className="text-sm text-muted hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#friccion-cero" className="text-sm text-muted hover:text-white transition-colors">Fricción Cero</a></li>
              <li><a href="#calculadora" className="text-sm text-muted hover:text-white transition-colors">Calcular Ganancias</a></li>
              <li><a href="#como-funciona" className="text-sm text-muted hover:text-white transition-colors">Cómo Funciona</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/terminos" className="text-sm text-muted hover:text-white transition-colors">Términos para Creadores</Link></li>
              <li><Link href="/privacidad" className="text-sm text-muted hover:text-white transition-colors">Políticas de Privacidad</Link></li>
              <li><a href="#" className="text-sm text-muted hover:text-white transition-colors">Soporte DMCA</a></li>
              <li><a href="#" className="text-sm text-muted hover:text-white transition-colors">Contacto</a></li>
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
