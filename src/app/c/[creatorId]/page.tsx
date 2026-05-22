'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Star, ExternalLink, Shield, Zap, Mail, Instagram, Music2 } from 'lucide-react';

export default function CreatorProfilePage({ params }: { params: { creatorId: string } }) {
  const [profile, setProfile] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.creatorId)
        .single();

      const { data: contentData } = await supabase
        .from('content')
        .select('*')
        .eq('creator_id', params.creatorId)
        .eq('is_active', true);

      setProfile(profileData);
      setPacks(contentData || []);
      setLoading(false);
    };
    fetch();
  }, [params.creatorId]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted">Cargando...</p>
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
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Creador no encontrado</h1>
            <Link href="/" className="text-accent-cyan hover:underline">Volver al inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const stageName = profile.stage_name || 'Creador';
  const socials = profile.socials ? profile.socials.split('\n').filter((s: string) => s.trim()) : [];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Creator Profile */}
          <div className="glass-card rounded-2xl p-8 mb-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-3xl font-bold mb-4">
              {stageName.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{stageName}</h1>
            <p className="text-muted max-w-md mx-auto mb-6">Creadora de contenido exclusivo en Drops</p>

            {socials.length > 0 && (
              <div className="flex items-center justify-center gap-4 mb-6">
                {socials.map((s: string, i: number) => {
                  const isInstagram = s.toLowerCase().includes('instagram') || s.toLowerCase().includes('ig');
                  const isTiktok = s.toLowerCase().includes('tiktok');
                  const url = s.replace(/^(Instagram|TikTok|X|Twitter|IG):\s*/i, '').trim();
                  const href = url.startsWith('http') ? url : `https://${url}`;
                  return (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-accent-violet transition-colors" aria-label={isInstagram ? 'Instagram' : isTiktok ? 'TikTok' : 'Red social'}>
                      {isInstagram ? <Instagram className="w-5 h-5" /> : isTiktok ? <Music2 className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                    </a>
                  );
                })}
              </div>
            )}

            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-muted">Creador verificado por Drops</p>
          </div>

          {/* Content Packs */}
          <h2 className="text-xl font-bold mb-6">Contenido disponible</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {packs.length === 0 && (
              <p className="text-muted col-span-full text-center py-12">Este creador aún no tiene contenido disponible.</p>
            )}
            {packs.map((pack) => (
              <div key={pack.id} className="glass-card rounded-xl overflow-hidden group">
                <div className="aspect-square bg-dark-light/50 border-b border-slate-700/50 flex items-center justify-center">
                  {pack.media_urls?.[0] ? (
                    <img src={pack.media_urls[0]} alt={pack.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">📦</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1">{pack.title}</h3>
                  <p className="text-xs text-muted mb-4">{pack.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-accent-cyan">${pack.price}</span>
                    <Link
                      href={`/checkout?creatorId=${params.creatorId}&packId=${pack.id}&price=${pack.price}&title=${encodeURIComponent(pack.title)}&creator=${encodeURIComponent(stageName)}`}
                      className="px-4 py-2 bg-accent-violet text-white text-sm font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-1"
                    >
                      Comprar
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
                <p className="text-xs text-muted">Múltiples métodos de pago</p>
              </div>
              <div>
                <Mail className="w-8 h-8 text-accent-violet mx-auto mb-2" />
                <p className="text-sm font-semibold mb-1">Entrega Automática</p>
                <p className="text-xs text-muted">Contenido por email al instante</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}