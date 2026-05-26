'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 glass border-b border-slate-800/50" role="banner">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Navegación principal">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Drops - Inicio">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 text-accent-cyan group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] transition-all duration-300" viewBox="0 0 32 40" fill="none" aria-hidden="true">
                <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropGrad)"/>
                <defs><linearGradient id="dropGrad" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Drops</span>
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <li><Link href="/#inicio" className="hover:text-white transition-colors duration-200">Inicio</Link></li>
            <li><Link href="/#servicios" className="hover:text-white transition-colors duration-200">Servicios</Link></li>
            <li><Link href="/#friccion-cero" className="hover:text-white transition-colors duration-200">Fricción Cero</Link></li>
            <li><Link href="/#calculadora" className="hover:text-white transition-colors duration-200">Calcular Ganancias</Link></li>
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/unite" className="px-5 py-2.5 bg-accent-violet text-white text-sm font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all duration-300">
              Unite
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-3 z-50 relative"
            aria-label="Abrir menú de navegación"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 bg-dark z-[100] md:hidden flex flex-col transition-all duration-300 ease-out ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/50">
          <span className="text-lg font-bold">Menú</span>
          <button onClick={() => setMenuOpen(false)} className="p-3" aria-label="Cerrar menú">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pt-6 pb-4 space-y-1" aria-label="Navegación móvil">
            <Link href="/#inicio" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-white rounded-xl hover:bg-slate-800/50 active:bg-slate-800/70 transition-colors">
              <svg className="w-6 h-6 text-accent-cyan flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              Inicio
            </Link>
            <Link href="/#servicios" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-muted rounded-xl hover:text-white hover:bg-slate-800/50 active:bg-slate-800/70 transition-colors">
              <svg className="w-6 h-6 text-accent-violet flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Servicios
            </Link>
            <Link href="/#friccion-cero" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-muted rounded-xl hover:text-white hover:bg-slate-800/50 active:bg-slate-800/70 transition-colors">
              <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Fricción Cero
            </Link>
            <Link href="/#calculadora" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 text-lg font-medium text-muted rounded-xl hover:text-white hover:bg-slate-800/50 active:bg-slate-800/70 transition-colors">
              <svg className="w-6 h-6 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Calcular Ganancias
            </Link>
          </nav>
          <div className="px-4 pb-8 pt-2 space-y-3 border-t border-slate-800/50">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-3 w-full py-4 text-base font-medium text-muted rounded-xl border border-slate-700/50 hover:text-white hover:bg-slate-800/50 active:bg-slate-800/70 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
              Iniciar Sesión
            </Link>
            <Link href="/unite" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-4 bg-accent-violet text-white text-base font-bold rounded-xl neon-glow hover:bg-violet-600 active:bg-violet-700 transition-all">
              Unite
            </Link>
          </div>
      </div>
    </>
  );
}
