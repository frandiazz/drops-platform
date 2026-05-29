'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);
  const [application, setApplication] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!token) {
      setValidating(false);
      setError('Token de registro inválido');
      return;
    }

    setValidating(true);
    fetch(`/api/validate-token?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          setError('Token inválido o expirado');
          return;
        }
        const data = await res.json();
        setApplication({ name: data.name, email: data.email });
      })
      .catch(() => {
        setError('Error al validar el token');
      })
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register-with-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <h1 className="text-3xl font-extrabold mb-4">¡Cuenta Creada!</h1>
        <p className="text-muted mb-4">Tu cuenta fue creada exitosamente. Ya podés acceder al dashboard.</p>
        <p className="text-sm text-muted mb-8">Redirigiendo al inicio de sesión...</p>
        <Link href="/login" className="text-accent-cyan hover:text-white transition-colors inline-flex items-center gap-2">
          Ir al inicio de sesión <ArrowLeft className="w-4 h-4 rotate-180" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  if (validating) {
    return (
      <div className="text-center">
        <div className="animate-pulse text-accent-cyan text-xl font-bold">Verificando invitación...</div>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-extrabold mb-4">Invitación Inválida</h1>
        <p className="text-muted mb-8">{error}</p>
        <Link href="/" className="text-accent-cyan hover:text-white transition-colors">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold">Creá tu cuenta</h1>
        <p className="text-muted mt-2 text-sm">Fuiste aprobada para unirte a Drops</p>
      </div>

      {application && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-green-400">Bienvenida, {application.name}!</p>
          <p className="text-xs text-muted mt-1">Tu email: {application.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
        {error && (
          <div role="alert" className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
        )}

        {application && (
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
              <input type="email" value={application.email} disabled
                className="w-full h-12 rounded-lg bg-dark-light/50 border border-slate-700/50 pl-10 pr-4 text-muted cursor-not-allowed" />
          </div>
          <div>
            <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-muted mb-2">Confirmar contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
              <input id="reg-confirm-password" type="password" required minLength={6} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Repetí tu contraseña" />
            </div>
          </div>
          </div>
        )}

        <div>
          <label htmlFor="reg-password" className="block text-sm font-medium text-muted mb-2">Crear contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" aria-hidden="true" />
            <input id="reg-password" type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
              placeholder="Mínimo 6 caracteres" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-12 bg-accent-violet text-white font-bold rounded-lg neon-glow hover:bg-violet-600 transition-all duration-300 disabled:opacity-50">
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Volver al inicio
        </Link>
        <Suspense fallback={<div className="text-center animate-pulse text-accent-cyan">Cargando...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}


