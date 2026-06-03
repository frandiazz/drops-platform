'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Star, ExternalLink, Shield, Zap, Mail, Instagram, Music2, BadgeCheck, Link as LinkIcon, Lock, Film } from 'lucide-react';
import type { Profile } from '@/types';

function firstImage(urls: string[] | null | undefined): string | null {
  if (!urls) return null;
  return urls.find(url => !/\.(mp4|webm|ogg)$/i.test(url)) || null;
}

export default function CreatorProfilePage({ params }: { params: { creatorId: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await fetch(`/api/profile?creatorId=${params.creatorId}`);
        const profileData = await profileRes.json();

        if (!profileRes.ok) {
          setLoadError(profileData.error || 'Error al cargar el perfil');
          setLoading(false);
          return;
        }

        if (profileData?.id) setProfile(profileData);
      } catch (err) {
        setLoadError('Error de conexión');
      }

      try {
        const contentRes = await supabase
          .from('content')
          .select('id, type, price, subscription_price, title, media_urls')
          .eq('creator_id', params.creatorId)
          .eq('is_active', true);
        if (contentRes.data) setPacks(contentRes.data);
      } catch (err2) { console.error('Pack load error:', err2); }

      setLoading(false);
    };
    loadData();
  }, [params.creatorId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted animate-pulse">Cargando...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Creador no encontrado</h1>
            <p className="text-muted text-sm mb-6">{loadError || 'El enlace es inválido o el creador ya no existe.'}</p>
            <Link href="/" className="text-accent-cyan hover:underline">Volver al inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const stageName = profile.stage_name || 'Creador';
  const bio = profile.bio || '';
  const avatarUrl = profile.avatar_url || '';

  const SANITIZE = (s: string) => s.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c));
  const cleanSocial = (val: string) => val.replace(/^@/, '').replace(/[^a-zA-Z0-9_.]/g, '').trim();

  const socialLinks: { icon: React.ComponentType<{ className?: string }>; href: string; label: string }[] = [];
  if (profile.instagram) socialLinks.push({ icon: Instagram, href: `https://www.instagram.com/${cleanSocial(profile.instagram)}`, label: 'Instagram' });
  if (profile.tiktok) socialLinks.push({ icon: Music2, href: `https://www.tiktok.com/@${cleanSocial(profile.tiktok)}`, label: 'TikTok' });
  if (profile.twitter) socialLinks.push({ icon: Star, href: `https://x.com/${cleanSocial(profile.twitter)}`, label: 'X' });

  const extraSocials = profile.socials ? profile.socials.split('\n').filter((s: string) => s.trim()) : [];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors mb-6 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Volver
          </Link>
          {/* Creator Profile */}
          <div className="glass-card rounded-2xl p-8 mb-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-3xl font-bold mb-4 relative">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={stageName} fill className="object-cover" sizes="96px" />
              ) : (
                stageName.charAt(0).toUpperCase()
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{stageName}</h1>
            <p className="text-muted max-w-md mx-auto mb-6">{bio || 'Creadora de contenido exclusivo en Drops'}</p>

            {(socialLinks.length > 0 || extraSocials.length > 0) && (
              <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
                {socialLinks.map((link, i) => (
                  <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-accent-violet transition-colors" aria-label={link.label}>
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
                {extraSocials.map((s: string, i: number) => {
                  const isInstagram = s.toLowerCase().includes('instagram') || s.toLowerCase().includes('ig');
                  const isTiktok = s.toLowerCase().includes('tiktok');
                  const isX = s.toLowerCase().includes('x') || s.toLowerCase().includes('twitter');
                  let raw = s.replace(/^(Instagram|TikTok|X|Twitter|IG):\s*/i, '').trim();
                  raw = raw.replace(/^@/, '').replace(/[^a-zA-Z0-9_.:/?-]/g, '');
                  let href: string;
                  if (raw.startsWith('https://')) {
                    href = raw;
                  } else if (isInstagram) {
                    href = `https://www.instagram.com/${raw}`;
                  } else if (isTiktok) {
                    href = `https://www.tiktok.com/@${raw}`;
                  } else if (isX) {
                    href = `https://x.com/${raw}`;
                  } else {
                    href = `https://${raw}`;
                  }
                  // Only allow http/https protocols
                  if (!href.startsWith('http://') && !href.startsWith('https://')) {
                    href = '#';
                  }
                  return (
                    <a key={`extra-${i}`} href={href} target="_blank" rel="noopener noreferrer" className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg glass flex items-center justify-center text-muted hover:text-accent-violet transition-colors">
                      {isInstagram ? <Instagram className="w-5 h-5" /> : isTiktok ? <Music2 className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                    </a>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 mb-2">
              <BadgeCheck className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
              <span className="text-xs text-muted">Verificado por Drops</span>
            </div>
          </div>

          {/* Content Packs */}
          <h2 className="text-xl font-bold mb-4">Contenido disponible</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
            {packs.length === 0 && (
              <p className="text-muted col-span-full text-center py-12">Este creador aún no tiene contenido disponible.</p>
            )}
            {packs.map((pack) => {
              const checkoutHref = `/checkout?creatorId=${params.creatorId}&packId=${pack.id}`;
              return (
                <div key={pack.id} className="group rounded-xl overflow-hidden glass-card transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <Link href={checkoutHref} className="block">
                    <div className="aspect-square bg-dark-light/50 relative">
                      {(() => {
                        const img = firstImage(pack.media_urls);
                        return img ? (
                          <>
                            <Image src={img} alt={pack.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-lg bg-black/40 group-hover:bg-black/30 transition-colors">
                              <Lock className="w-8 h-8 text-white/80" />
                              <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">Bloqueado</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-dark-light/30">
                            <Film className="w-10 h-10 text-muted/50" />
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 backdrop-blur-lg bg-black/40 group-hover:bg-black/30 transition-colors">
                              <Lock className="w-8 h-8 text-white/80" />
                              <span className="text-[10px] font-medium text-white/90 uppercase tracking-wider">Bloqueado</span>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-[11px] font-bold text-white leading-none inline-block">
                          {pack.type === 'subscription' ? `$${pack.subscription_price}/mes` : `$${pack.price}`}
                        </span>
                      </div>
                      {pack.type === 'subscription' && (
                        <div className="absolute top-1.5 right-1.5">
                          <span className="px-1.5 py-0.5 bg-cyan-500/80 backdrop-blur-sm rounded text-[10px] font-semibold text-white">🔄</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-2.5 space-y-2">
                    <h3 className="text-sm font-semibold truncate leading-tight">{pack.title}</h3>
                    <Link
                      href={checkoutHref}
                      className="block w-full py-3 bg-accent-violet text-white text-xs font-semibold rounded-lg text-center hover:bg-violet-600 transition-colors"
                    >
                      {pack.type === 'subscription' ? 'Suscribirse' : 'Comprar'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Section */}
          <div className="glass rounded-xl p-6 text-center">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <Zap className="w-8 h-8 text-accent-cyan mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">Checkout Express</p>
                <p className="text-xs text-muted">Sin registro, sin contraseñas</p>
              </div>
              <div>
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">Pago Seguro</p>
                <p className="text-xs text-muted">Visa, Mastercard, Amex</p>
              </div>
              <div>
                <LinkIcon className="w-8 h-8 text-accent-violet mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">Acceso Inmediato</p>
                <p className="text-xs text-muted">Contenido disponible al instante</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}