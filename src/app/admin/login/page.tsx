'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useToast } from '@/components/Toast';

export default function AdminLoginPage() {
  const { addToast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No se pudo obtener el usuario');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('No tenés permisos de administrador. El administrador debe configurarse desde Supabase.');
      }

      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo size={40} showText={false} /><span className="text-2xl font-bold gradient-text">Admin</span>
          </div>
          <h1 className="text-2xl font-extrabold">Acceso <span className="gradient-text">Administrador</span></h1>
          <p className="text-muted mt-2 text-sm">Solo personal autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input id="admin-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="dropsdrops2005@gmail.com" />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-muted mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input id="admin-password" type="password" required minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-12 bg-accent-violet text-white font-bold rounded-lg neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50">
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
          <div className="text-center">
            <button type="button" onClick={() => { if (email) { supabase.auth.resetPasswordForEmail(email); addToast('Si el email existe, recibirás un link de recuperación.', 'info'); } else { addToast('Ingresá tu email primero.', 'error'); } }} className="text-xs text-muted hover:text-accent-cyan transition-colors py-2">
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          ¿No tenés cuenta? <Link href="/dashboard/login" className="text-accent-cyan hover:underline">Crear cuenta primero</Link>
        </p>
      </div>
    </div>
  );
}
