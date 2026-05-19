'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Droplets } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
          <li><a href="#inicio" className="hover:text-white transition-colors duration-200">Inicio</a></li>
          <li><a href="#servicios" className="hover:text-white transition-colors duration-200">Servicios</a></li>
          <li><a href="#friccion-cero" className="hover:text-white transition-colors duration-200">Fricción Cero</a></li>
          <li><a href="#calculadora" className="hover:text-white transition-colors duration-200">Calcular Ganancias</a></li>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard/login" className="px-4 py-2 text-sm font-medium text-muted hover:text-white transition-colors">
            Iniciar Sesión
          </Link>
          <Link href="#postularme" className="px-5 py-2.5 bg-accent-violet text-white text-sm font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all duration-300">
            Unite como Creador
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2 z-50 relative"
          aria-label="Abrir menú de navegación"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <span className="block w-6 h-0.5 bg-white transition-all duration-300 origin-center"></span>
              <span className="block w-6 h-0.5 bg-white transition-all duration-300"></span>
              <span className="block w-4 h-0.5 bg-white transition-all duration-300 origin-center ml-auto"></span>
            </>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 top-16 bg-dark/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8 text-lg font-medium z-40">
          <a href="#inicio" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white transition-colors">Inicio</a>
          <a href="#servicios" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white transition-colors">Servicios</a>
          <a href="#friccion-cero" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white transition-colors">Fricción Cero</a>
          <a href="#calculadora" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white transition-colors">Calcular Ganancias</a>
          <Link href="/dashboard/login" onClick={() => setMenuOpen(false)} className="text-muted hover:text-white transition-colors">Iniciar Sesión</Link>
          <a href="#postularme" onClick={() => setMenuOpen(false)} className="mt-4 px-8 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow">Unite como Creador</a>
        </div>
      )}
    </header>
  );
}
