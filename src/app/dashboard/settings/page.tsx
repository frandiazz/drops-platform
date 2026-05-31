'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { User as UserIcon, Mail, Save, Camera, Link as LinkIcon, Instagram, Music2, Twitter, Globe, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/Toast';
import type { User } from '@supabase/supabase-js';

const ConfirmDialog = dynamic(() => import('@/components/ConfirmDialog'), { ssr: false });

export default function SettingsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [stageName, setStageName] = useState('');
  const [bio, setBio] = useState('');
  const [socials, setSocials] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');
  const [commissionRate, setCommissionRate] = useState(20);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const accessTokenRef = useRef<string>('');

  const userId = user?.id;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const profileUrl = userId ? `${siteUrl}/c/${userId}` : '';

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        accessTokenRef.current = session.access_token;
        setUser(session.user);
        const m = session.user.user_metadata || {};
        setStageName(m.stage_name || '');
        setBio(m.bio || '');
        setSocials(m.socials || '');
        setAvatarUrl(m.avatar_url || '');
        setInstagram(m.instagram || '');
        setTiktok(m.tiktok || '');
        setTwitter(m.twitter || '');

        // Load commission rate from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('commission_rate, stage_name, avatar_url, bio, socials, instagram, tiktok, twitter')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.commission_rate) setCommissionRate(profile.commission_rate);

        // Auto-create profile record if missing
        if (!profile) {
          await supabase.from('profiles').upsert({
            id: session.user.id,
            stage_name: m.stage_name || 'Creador',
            email: session.user.email || '',
            role: 'creator',
            commission_rate: 20,
          });
        }
      }
    });
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'avatars');
      if (!accessTokenRef.current) {
        addToast('Sesión no disponible. Recargá la página.', 'error');
        return;
      }
      const res = await fetch('/api/upload-file', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessTokenRef.current}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Error al subir la foto', 'error');
        return;
      }
      if (data.url) {
        setAvatarUrl(data.url);
        if (user) {
          await supabase.auth.updateUser({ data: { avatar_url: data.url } });
          const { error: upsErr } = await supabase.from('profiles').upsert({
            id: user.id,
            avatar_url: data.url,
          });
          if (upsErr) throw upsErr;
        }
        addToast('Foto de perfil actualizada', 'success');
      }
    } catch (err) {
      console.error('Avatar upload/save error:', err);
      const msg = err instanceof Error ? err.message : typeof err === 'object' && err !== null && 'message' in err ? String((err as Record<string, unknown>).message) : 'Error al guardar la foto de perfil';
      addToast(msg, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaveError('');
    try {
      if (user) {
        const { error: upsertError } = await supabase.from('profiles').upsert({
          id: user.id,
          stage_name: stageName,
          avatar_url: avatarUrl,
          bio,
          socials,
          instagram,
          tiktok,
          twitter,
          email: user.email,
        });
        if (upsertError) throw upsertError;
      }

      const metadata = {
        stage_name: stageName,
        bio,
        socials,
        avatar_url: avatarUrl,
        instagram,
        tiktok,
        twitter,
      };
      const { error: updateError } = await supabase.auth.updateUser({ data: metadata });
      if (updateError) console.error('Auth metadata update failed:', updateError);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : typeof err === 'object' && err !== null && 'message' in err ? String((err as Record<string, unknown>).message) : 'Error al guardar';
      setSaveError(message);
      console.error('handleSave error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    setConfirmDelete(false);
    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.success) {
        await supabase.auth.signOut();
        router.push('/');
      } else {
        addToast(data.error || 'Error al eliminar cuenta', 'error');
      }
    } catch (err) {
      console.error('Account deletion error:', err);
      addToast('Error del servidor', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          <span className="gradient-text">Configuración</span>
        </h1>
        <p className="text-muted mt-1">Personalizá tu perfil público de Drops.</p>
      </div>

      <div className="space-y-6 max-w-2xl">

        {/* Avatar */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-accent-violet" />
            Foto de perfil
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-dark-light/80 border border-slate-700/50 flex-shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Foto de perfil" width={80} height={80} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted">
                  {stageName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs text-white">Subiendo...</div>}
            </div>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-accent-violet/20 text-accent-violet rounded-lg hover:bg-accent-violet/30 transition-colors text-sm font-medium"
              >
                {avatarUrl ? 'Cambiar foto' : 'Subir foto'}
              </button>
              <p className="text-xs text-muted mt-2">Recomendado: cuadrado, 512x512px</p>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-accent-violet" />
            Perfil público
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email</label>
              <div className="flex items-center gap-2 h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-muted text-sm">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>

            {profileUrl && (
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Tu link de perfil</label>
                <div className="flex items-center gap-2 h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-sm">
                  <LinkIcon className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                  <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline truncate">{profileUrl}</a>
                  <button onClick={() => { navigator.clipboard.writeText(profileUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="ml-auto flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-accent-cyan hover:text-white rounded-lg hover:bg-accent-violet/10 transition-colors flex-shrink-0">
                    <LinkIcon className="w-3.5 h-3.5" /> {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="stageName" className="block text-sm font-medium text-muted mb-2">Nombre / Apodo</label>
              <input
                id="stageName"
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Ej: Fran Drops"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-muted mb-2">Biografía</label>
              <textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Contá quién sos y qué contenido creás..."
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent-cyan" />
            Redes sociales
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400" /> Instagram
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="usuario"
              />
              <p className="text-xs text-slate-600 mt-1">Solo tu usuario, sin @ ni link completo</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
                <Music2 className="w-4 h-4 text-pink-400" /> TikTok
              </label>
              <input
                type="text"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="usuario"
              />
              <p className="text-xs text-slate-600 mt-1">Solo tu usuario, sin @ ni link completo</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2 flex items-center gap-2">
                <Twitter className="w-4 h-4 text-sky-400" /> X / Twitter
              </label>
              <input
                type="text"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="usuario"
              />
              <p className="text-xs text-slate-600 mt-1">Solo tu usuario, sin @ ni link completo</p>
            </div>

            <div className="pt-2 border-t border-slate-700/30">
              <label htmlFor="socials" className="block text-sm font-medium text-muted mb-2">Otras redes</label>
              <textarea
                id="socials"
                rows={2}
                value={socials}
                onChange={(e) => setSocials(e.target.value)}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Ej: https://onlyfans.com/tuusuario"
              />
              <p className="text-xs text-slate-600 mt-1">Pegá el link completo para redes que no sean IG, TikTok o X</p>
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saved ? 'Guardado!' : 'Guardar cambios'}
            </button>
            {saveError && <p className="text-xs text-red-400 mt-2">{saveError}</p>}
          </div>
        </div>

        {/* Public URL Preview */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-green-400" />
            Vista previa de tu perfil
          </h3>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-dark-light/50">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-light/80 flex-shrink-0">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Foto de perfil" width={48} height={48} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted">{stageName?.charAt(0)?.toUpperCase() || '?'}</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{stageName || 'Tu nombre'}</p>
              <p className="text-xs text-muted truncate">{bio || 'Tu biografía'}</p>
            </div>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-cyan hover:underline flex items-center gap-1 flex-shrink-0">
              Ver perfil <LinkIcon className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Service Level */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-cyan" />
            Nivel de servicio
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Full Management', desc: 'Manejamos todo: IG, X, TikTok, Telegram' },
              { label: 'Social Media Only', desc: 'Manejamos redes, vos manejás Telegram' },
              { label: 'Solo Plataforma', desc: 'Usás Drops, hacés todo sola' },
            ].map((plan, i) => {
              return (
              <div key={i} className="p-4 rounded-lg border border-slate-700/50 bg-dark-light/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{plan.label}</p>
                    <p className="text-xs text-muted">{plan.desc}</p>
                  </div>
                  <span className="text-sm font-bold text-accent-violet">20%</span>
                </div>
              </div>
              );
            })}
          </div>
          <p className="text-xs text-muted mt-4">
            Para cambiar tu nivel de servicio, contactanos a DropsDrops2005@gmail.com
          </p>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-xl p-6 border-red-500/20">
          <h3 className="text-lg font-bold mb-4 text-red-400">Zona de peligro</h3>
          <p className="text-sm text-muted mb-4">Al eliminar tu cuenta, perderás acceso a todo tu contenido y ganancias pendientes.</p>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={deleting}
            className="px-6 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {deleting ? 'Eliminando...' : 'Eliminar cuenta'}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar cuenta"
        message="¿Estás segura? Esta acción eliminará tu cuenta, todo tu contenido y no podrá deshacerse."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}


