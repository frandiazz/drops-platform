'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { ArrowLeft, Send, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: '', email: '', age: '', country: '',
    instagram: '', tiktok: '', twitter: '', other_social: '',
    experience: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 3) {
      setError('Máximo 3 fotos');
      return;
    }
    setError('');
    const newPhotos = [...photos, ...files].slice(0, 3);
    setPhotos(newPhotos);

    const newUrls = newPhotos.map(f => URL.createObjectURL(f));
    photoUrls.forEach(u => URL.revokeObjectURL(u));
    setPhotoUrls(newUrls);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    const newUrls = photoUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(photoUrls[index]);
    setPhotoUrls(newUrls);
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of photos) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload-application-photo', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) urls.push(data.url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (photos.length < 2) {
      setError('Subí al menos 2 fotos');
      setLoading(false);
      return;
    }

    try {
      if (!termsAccepted) {
        throw new Error('Debés aceptar los términos y condiciones');
      }

      setUploading(true);
      const uploadedUrls = await uploadPhotos();
      setUploading(false);

      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          age: form.age ? parseInt(form.age) : null,
          photo_urls: uploadedUrls,
          terms_accepted: true,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Error');

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar');
    } finally {
      setLoading(false);
      setUploading(false);
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
            <p className="text-muted mb-4">
              Recibimos tu solicitud. Nuestro equipo la va a revisar y si avanzamos,
              te vamos a contactar por <span className="text-white font-semibold">Instagram</span> o <span className="text-white font-semibold">TikTok</span>.
            </p>
            <p className="text-sm text-muted mb-8">
              Guardá este link para ver el estado de tu postulación:
            </p>
            <div className="glass rounded-xl p-4 mb-8 text-sm text-muted break-all">
              {typeof window !== 'undefined' && `${window.location.origin}/apply?email=${encodeURIComponent(form.email)}`}
            </div>
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
          <Link href="/unite" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-8 py-2">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <div className="text-center mb-10">
            <span className="text-accent-cyan text-sm font-semibold uppercase tracking-widest">Management</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-3">
              Postulación para <span className="gradient-text">Management</span>
            </h1>
            <p className="text-muted text-sm max-w-lg mx-auto">
              Completá el formulario con tus datos y algunas fotos. Vamos a revisar
              tu perfil y si creemos que tenés potencial, te contactamos por
              Instagram o TikTok para coordinar los próximos pasos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 sm:p-10 space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-semibold text-muted mb-2">Nombre artístico</label>
                <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  placeholder="Tu nombre artístico" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-muted mb-2">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  placeholder="tu@email.com" />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-semibold text-muted mb-2">Edad</label>
                <input id="age" name="age" type="number" required min={18} value={form.age} onChange={handleChange}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  placeholder="18" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="country" className="block text-sm font-semibold text-muted mb-2">País</label>
                <input id="country" name="country" type="text" required value={form.country} onChange={handleChange}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
                  placeholder="Argentina" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-muted mb-3">Redes sociales (sin @)</label>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted mb-1 block">Instagram</label>
                  <input name="instagram" value={form.instagram} onChange={handleChange}
                    className="w-full h-11 rounded-lg bg-dark-light/80 border border-slate-700/50 px-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-sm"
                    placeholder="Tu usuario de Instagram" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">TikTok</label>
                  <input name="tiktok" value={form.tiktok} onChange={handleChange}
                    className="w-full h-11 rounded-lg bg-dark-light/80 border border-slate-700/50 px-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-sm"
                    placeholder="Tu usuario de TikTok" />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1 block">X / Twitter</label>
                  <input name="twitter" value={form.twitter} onChange={handleChange}
                    className="w-full h-11 rounded-lg bg-dark-light/80 border border-slate-700/50 px-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-sm"
                    placeholder="Tu usuario de X" />
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs text-muted mb-1 block">Otras redes (link completo)</label>
                <input name="other_social" value={form.other_social} onChange={handleChange}
                  className="w-full h-11 rounded-lg bg-dark-light/80 border border-slate-700/50 px-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors text-sm"
                  placeholder="https://..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-muted mb-3">Fotos (2-3 fotos para evaluar tu perfil)</label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i}>
                    {photoUrls[i] ? (
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-700/50">
                        <Image src={photoUrls[i]} alt={`Foto ${i + 1}`} width={240} height={320} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePhoto(i)} aria-label="Eliminar foto"
                          className="absolute top-1 right-1 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700/50 flex flex-col items-center justify-center gap-2 text-muted hover:border-accent-violet/50 hover:text-accent-violet transition-colors">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Foto {i + 1}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoSelect} className="hidden" />
              <p className="text-xs text-muted mt-2">Subí al menos 2 fotos claras donde se te vea bien</p>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-semibold text-muted mb-2">
                ¿Por qué querés unirte? / Experiencia previa
              </label>
              <textarea id="experience" name="experience" rows={4} value={form.experience} onChange={handleChange}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Contanos sobre vos, qué contenido hacés, por qué querés que te managemos..." />
            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-dark-light accent-accent-violet focus:ring-accent-violet"
              />
              <label htmlFor="terms" className="text-xs text-muted leading-relaxed cursor-pointer select-none">
                Acepto los{' '}
                <Link href="/terminos" className="text-accent-cyan hover:underline">términos y condiciones</Link> de Drops
                y confirmo que soy mayor de 18 años. Entiendo que, si soy seleccionada,
                Drops se comunicará conmigo a través de mis redes sociales.
              </label>
            </div>

            <button type="submit" disabled={loading || uploading || !termsAccepted}
              className="w-full h-14 bg-accent-violet text-white font-bold rounded-xl neon-glow hover:bg-violet-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Subiendo fotos...' : loading ? 'Enviando...' : (
                <><Send className="w-5 h-5" /> Enviar Postulación</>
              )}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
