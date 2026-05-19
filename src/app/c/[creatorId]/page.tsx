import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Star, ExternalLink, Shield, Zap, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function CreatorProfilePage() {
  const creator = {
    name: 'Nombre del Creador',
    bio: 'Creadora de contenido exclusivo. Contenido de alta calidad actualizado semanalmente.',
    avatar: null,
    socials: { instagram: '#', twitter: '#', tiktok: '#' },
  };

  const contentPacks = [
    { id: 1, title: 'Premium Pack #1', description: 'Contenido exclusivo de alta calidad', price: 29.99, image: null },
    { id: 2, title: 'Premium Pack #2', description: 'Nuevo contenido actualizado', price: 19.99, image: null },
    { id: 3, title: 'Premium Pack #3', description: 'Pack especial de colección', price: 49.99, image: null },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Creator Profile */}
          <div className="glass-card rounded-2xl p-8 mb-12 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-3xl font-bold mb-4">
              {creator.name.charAt(0)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{creator.name}</h1>
            <p className="text-muted max-w-md mx-auto mb-6">{creator.bio}</p>

            <div className="flex items-center justify-center gap-4 mb-6">
              {creator.socials.instagram && (
                <a href={creator.socials.instagram} className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-accent-violet transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {creator.socials.tiktok && (
                <a href={creator.socials.tiktok} className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted hover:text-accent-cyan transition-colors" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.78V6.69h3.77z"/></svg>
                </a>
              )}
            </div>

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
            {contentPacks.map((pack) => (
              <div key={pack.id} className="glass-card rounded-xl overflow-hidden group">
                <div className="aspect-square bg-dark-light/50 border-b border-slate-700/50 flex items-center justify-center">
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-300">📦</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1">{pack.title}</h3>
                  <p className="text-xs text-muted mb-4">{pack.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-accent-cyan">${pack.price}</span>
                    <Link
                      href="/checkout"
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

          <div className="mt-8 text-center">
            <p className="text-xs text-muted">
              Powered by <Link href="/" className="text-accent-cyan hover:underline font-medium">Drops</Link> · 
              Si la entrega se realiza por fuera de la app, Drops no se hace responsable.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
