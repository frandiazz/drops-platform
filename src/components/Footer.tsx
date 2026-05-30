import { memo } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const Footer = memo(function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-dark-light/30" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={28} />
            </Link>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              La plataforma de monetización y management para creadores de contenido y modelos de IA. Maximizamos tus ingresos con tecnología de vanguardia.
            </p>
            <div className="flex flex-col gap-2 mt-6 text-sm text-muted">
              <a href="mailto:hola@drops.agency" className="flex items-center gap-2 hover:text-accent-cyan transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                hola@drops.agency
              </a>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Buenos Aires, Argentina
              </span>
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
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li><a href="mailto:hola@drops.agency" className="block py-2 text-sm text-muted hover:text-white transition-colors">hola@drops.agency</a></li>
              <li><a href="mailto:dmca@drops.agency" className="block py-2 text-sm text-muted hover:text-white transition-colors">Soporte DMCA</a></li>
              <li><Link href="/terminos" className="block py-2 text-sm text-muted hover:text-white transition-colors">Términos para Creadores</Link></li>
              <li><Link href="/privacidad" className="block py-2 text-sm text-muted hover:text-white transition-colors">Políticas de Privacidad</Link></li>
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
});

export default Footer;
