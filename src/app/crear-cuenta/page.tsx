'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';

export default function CrearCuentaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.session) {
        router.push('/dashboard');
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-extrabold mb-4">Cuenta creada</h1>
          <p className="text-muted mb-2">Revisá tu email para confirmar la cuenta.</p>
          <p className="text-sm text-muted mb-8">Si no encuentras el correo, revisá spam.</p>
          <Link href="/login" className="inline-flex items-center gap-2 text-accent-cyan hover:text-white transition-colors font-medium">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="w-10 h-10 text-accent-cyan" viewBox="0 0 32 40" fill="none">
              <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropCrear)"/>
              <defs><linearGradient id="dropCrear" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
            </svg>
            <span className="text-2xl font-bold">Drops</span>
          </div>
          <h1 className="text-2xl font-extrabold">Crear Cuenta</h1>
          <p className="text-muted mt-2 text-sm">Empezá a usar la plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="email-crear" className="block text-sm font-medium text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input id="email-crear" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="tu@email.com" />
            </div>
          </div>

          <div>
            <label htmlFor="password-crear" className="block text-sm font-medium text-muted mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input id="password-crear" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Mínimo 6 caracteres" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-12 bg-accent-violet text-white font-bold rounded-lg neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50">
            {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
          </button>

          <p className="text-center text-sm text-muted">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-accent-cyan hover:underline font-medium">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
