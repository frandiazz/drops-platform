'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: '', email: '', instagram: '', tiktok: '', twitter: '',
    age: '', country: '', content_type: '', why_join: '',
    referral: '', experience: '', service: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, folder: 'applications' }),
      });
      const data = await res.json();
      if (data.url) {
        setPhotos((prev) => [...prev, data.url]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((f) => uploadPhoto(f));
    e.target.value = '';
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length < 2) {
      setError('Subí al menos 2 fotos para que podamos evaluar tu perfil.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photos }),
      });
      if (!res.ok) throw new Error('Error al enviar');

      const mailtoLink = `mailto:DropsDrops2005@gmail.com?subject=Nueva postulación: ${encodeURIComponent(form.name)}&body=${encodeURIComponent(
        `Nombre: ${form.name}\nEmail: ${form.email}\nIG: ${form.instagram}\nTK: ${form.tiktok}\nX: ${form.twitter}\nEdad: ${form.age}\nPaís: ${form.country}\nTipo contenido: ${form.content_type}\nServicio: ${form.service}\nFotos: ${photos.join('\n')}\n\nPor qué: ${form.why_join}\nReferencia: ${form.referral}\nExperiencia: ${form.experience}`
      )}`;
      window.open(mailtoLink, '_blank');

      setSubmitted(true);
    } catch (err) {
      setError('Error al enviar. Intentalo de nuevo.');
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
            <p className="text-muted mb-8">Recibimos tu solicitud. Si creemos que hay potencial, te vamos a contactar pronto.</p>
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
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Unite a <span className="gradient-text">Drops</span>
            </h1>
            <p className="text-muted text-lg">Completá el formulario. Si hay potencial, te contactamos.</p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 sm:p-10 space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-muted mb-2">Nombre artístico *</label>
              <input id="name" type="text" required value={form.name} onChange={(e) => update('name', e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Ej: Luna Martínez" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-muted mb-2">Email de contacto *</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="tu@email.com" />
            </div>

            {/* Redes sociales */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold text-muted mb-2">Instagram *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                  <input id="instagram" type="text" required value={form.instagram} onChange={(e) => update('instagram', e.target.value)}
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-8 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                    placeholder="usuario" />
                </div>
              </div>
              <div>
                <label htmlFor="tiktok" className="block text-sm font-semibold text-muted mb-2">TikTok</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                  <input id="tiktok" type="text" value={form.tiktok} onChange={(e) => update('tiktok', e.target.value)}
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-8 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                    placeholder="usuario" />
                </div>
              </div>
              <div>
                <label htmlFor="twitter" className="block text-sm font-semibold text-muted mb-2">X / Twitter</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                  <input id="twitter" type="text" value={form.twitter} onChange={(e) => update('twitter', e.target.value)}
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-8 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                    placeholder="usuario" />
                </div>
              </div>
            </div>

            {/* Edad y País */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-muted mb-2">Edad *</label>
                <input id="age" type="number" required min={18} max={99} value={form.age} onChange={(e) => update('age', e.target.value)}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  placeholder="18" />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-muted mb-2">País *</label>
                <input id="country" type="text" required value={form.country} onChange={(e) => update('country', e.target.value)}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  placeholder="Argentina, México, etc." />
              </div>
            </div>

            {/* Tipo de contenido */}
            <div>
              <label htmlFor="content_type" className="block text-sm font-semibold text-muted mb-2">Tipo de contenido que hacés *</label>
              <select id="content_type" required value={form.content_type} onChange={(e) => update('content_type', e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors appearance-none">
                <option value="" disabled>Seleccioná uno</option>
                <option value="fotos">Fotos</option>
                <option value="videos">Videos</option>
                <option value="ambos">Fotos y Videos</option>
                <option value="ia">Modelo IA</option>
                <option value="ia_fotos">Modelo IA + Fotos reales</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Servicio */}
            <div>
              <label htmlFor="service" className="block text-sm font-semibold text-muted mb-2">Servicio que necesitás *</label>
              <select id="service" required value={form.service} onChange={(e) => update('service', e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors appearance-none">
                <option value="" disabled>Seleccioná un servicio</option>
                <option value="full">Full Management (50%) — Manejamos todo: IG, X, Threads, TikTok, Telegram</option>
                <option value="social">Social Media Only (30%) — Manejamos redes, vos manejás Telegram</option>
                <option value="platform">Solo Plataforma (20%) — Usás Drops, hacés todo sola</option>
                <option value="course">Mini Curso ($100.000 ARS) — 10hs de formación por WhatsApp</option>
              </select>
            </div>

            {/* Fotos */}
            <div>
              <label className="block text-sm font-semibold text-muted mb-2">Fotos (mínimo 2) *</label>
              <p className="text-xs text-muted mb-3">Subí fotos claras de tu rostro y cuerpo para evaluar tu perfil. Sin filtros pesados.</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {photos.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700/50">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center gap-1 text-muted hover:border-accent-violet hover:text-accent-violet transition-colors disabled:opacity-50">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px]">{uploading ? '...' : 'Subir'}</span>
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </div>

            {/* Por qué */}
            <div>
              <label htmlFor="why_join" className="block text-sm font-semibold text-muted mb-2">¿Por qué querés unirte a Drops? *</label>
              <textarea id="why_join" required rows={3} value={form.why_join} onChange={(e) => update('why_join', e.target.value)}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Contanos sobre vos, tus objetivos, qué esperás de Drops..." />
            </div>

            {/* Referencia */}
            <div>
              <label htmlFor="referral" className="block text-sm font-semibold text-muted mb-2">¿Cómo nos conociste?</label>
              <input id="referral" type="text" value={form.referral} onChange={(e) => update('referral', e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Instagram, TikTok, recomendación, etc." />
            </div>

            {/* Experiencia */}
            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-muted mb-2">Experiencia previa (opcional)</label>
              <textarea id="experience" rows={2} value={form.experience} onChange={(e) => update('experience', e.target.value)}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Si ya vendiste contenido, tuviste un agente, etc." />
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading}
                className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar Postulación'}
              </button>
            </div>

            <p className="text-xs text-muted text-center">
              Al enviar, aceptás nuestros{' '}
              <Link href="/terminos" className="text-accent-cyan hover:underline">Términos y Condiciones</Link>.
              Si tenemos interés te vamos a contactar.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
