'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';

export default function CrearCuentaPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@') || !email.includes('.')) {
      setError('Ingresá un email válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { stage_name: 'Creador' },
        },
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (userId && data.session?.access_token) {
        await fetch('/api/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${data.session.access_token}` },
          body: JSON.stringify({ userId, email }),
        });
      }

      if (data.session) {
        router.push('/dashboard');
      } else {
        await supabase.auth.signInWithPassword({ email, password });
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Volver al inicio
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo size={40} />
          </div>
          <h1 className="text-2xl font-extrabold">Crear Cuenta</h1>
          <p className="text-muted mt-2 text-sm">Empezá a usar la plataforma</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && (
            <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="email-crear" className="block text-sm font-medium text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
              <input id="email-crear" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="tu@email.com" />
            </div>
          </div>

          <div>
            <label htmlFor="password-crear" className="block text-sm font-medium text-muted mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
              <input id="password-crear" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Mínimo 6 caracteres" />
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password-crear" className="block text-sm font-medium text-muted mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
              <input id="confirm-password-crear" type="password" required minLength={6} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Repetí tu contraseña" />
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
