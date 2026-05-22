'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ApplyPage() {
  const [form, setForm] = useState({ name: '', email: '', socials: '', service: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('applications').insert({
        name: form.name,
        email: form.email,
        socials: form.socials,
        service: form.service,
      });

      if (error) {
        console.error('Error saving:', error);
      }

      const mailtoLink = `mailto:DropsDrops2005@gmail.com?subject=Nueva postulación de creador: ${encodeURIComponent(form.name)}&body=${encodeURIComponent(
        `Nombre artístico: ${form.name}\nEmail: ${form.email}\nRedes sociales: ${form.socials}\nServicio deseado: ${form.service}`
      )}`;

      window.open(mailtoLink, '_blank');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h1 className="text-3xl font-extrabold mb-4">¡Postulación Enviada!</h1>
            <p className="text-muted mb-8">Recibimos tu solicitud. Te contactaremos en las próximas 24-48 horas para empezar a trabajar juntos.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-accent-cyan hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al inicio
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Unite a <span className="gradient-text">Drops</span>
            </h1>
            <p className="text-muted text-lg">Completá el formulario y empezá a monetizar tu contenido.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 sm:p-10 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-muted mb-2">Nombre artístico</label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Tu nombre artístico"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-muted mb-2">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="socials" className="block text-sm font-semibold text-muted mb-2">Redes sociales (links)</label>
              <textarea
                id="socials"
                required
                rows={3}
                value={form.socials}
                onChange={(e) => setForm({ ...form, socials: e.target.value })}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Instagram: @tuusuario&#10;TikTok: @tuusuario&#10;X: @tuusuario"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-semibold text-muted mb-2">Servicio que necesitás</label>
              <select
                id="service"
                required
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors appearance-none"
              >
                <option value="" disabled>Seleccioná un servicio</option>
                <option value="full">Full Management (50%) - Manejamos todo: IG, X, Threads, TikTok, Telegram</option>
                <option value="social">Social Media Only (30%) - Manejamos redes, vos manejás Telegram</option>
                <option value="platform">Solo Plataforma (20%) - Usás Drops, hacés todo sola</option>
                <option value="course">Mini Curso ($100.000 ARS) - 10hs de formación por WhatsApp</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Enviando...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Postulación
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-muted text-center">
              Al enviar, aceptás nuestros <a href="/terminos" className="text-accent-cyan hover:underline">Términos y Condiciones</a>.
              Te contactaremos en 24-48hs.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
