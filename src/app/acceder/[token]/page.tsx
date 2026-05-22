'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Clock, XCircle, Download, Send, Image as ImageIcon, FileText } from 'lucide-react';

export default function AccessPage({ params }: { params: { token: string } }) {
  const [sale, setSale] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSale = async () => {
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .select('*')
        .eq('access_token', params.token)
        .single();

      if (saleError || !saleData) {
        setError('Link inválido o expirado');
        setLoading(false);
        return;
      }

      setSale(saleData);

      if (saleData.content_id) {
        const { data: contentData } = await supabase
          .from('content')
          .select('*')
          .eq('id', saleData.content_id)
          .single();
        if (contentData) setContent(contentData);
      }

      setLoading(false);
    };
    fetchSale();
  }, [params.token]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <p className="text-muted animate-pulse">Verificando acceso...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Acceso no válido</h1>
            <p className="text-muted mb-6">{error}</p>
            <Link href="/" className="text-accent-cyan hover:underline">Volver al inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isCompleted = sale.payment_status === 'completed';

  if (!isCompleted) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Pago pendiente</h1>
            <p className="text-muted mb-4">Estamos esperando la confirmación de tu pago.</p>
            <div className="glass-card rounded-xl p-4 mb-6">
              <p className="text-xs text-muted">Email: <span className="text-white">{sale.buyer_email}</span></p>
              <p className="text-xs text-muted mt-1">Monto: <span className="text-accent-cyan font-bold">${sale.amount} USD</span></p>
            </div>
            <p className="text-xs text-muted">Si ya pagaste, el acceso se habilitará automáticamente en unos minutos.</p>
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
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
              ¡Contenido <span className="gradient-text">disponible</span>!
            </h1>
            <p className="text-muted">Gracias por tu compra, {sale.buyer_email}</p>
          </div>

          {content && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">{content.title}</h2>
              {content.description && (
                <p className="text-muted text-sm mb-4">{content.description}</p>
              )}

              {/* Media files */}
              {content.media_urls && content.media_urls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Archivos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {content.media_urls.map((url: string, i: number) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square rounded-xl bg-dark-light/50 border border-slate-700/50 overflow-hidden hover:border-accent-violet/50 transition-colors group relative"
                      >
                        {url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={url} className="w-full h-full object-cover" controls />
                        ) : (
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Telegram link */}
              {content.telegram_link && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-4">
                  <div className="flex items-start gap-3">
                    <Send className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Acceso a Telegram</p>
                      <p className="text-xs text-muted mb-3">Unite al grupo privado para acceder al contenido exclusivo:</p>
                      <a
                        href={content.telegram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors"
                      >
                        <Send className="w-4 h-4" /> Unirse al grupo
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery type info */}
              {content.delivery_type === 'download' && content.media_urls?.length > 0 && (
                <a
                  href={content.media_urls[0]}
                  download
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent-violet text-white font-semibold rounded-xl neon-glow hover:bg-violet-600 transition-all"
                >
                  <Download className="w-5 h-5" /> Descargar contenido
                </a>
              )}
            </div>
          )}

          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-xs text-muted mb-2">Compra realizada el {new Date(sale.created_at).toLocaleDateString('es-AR')}</p>
            <p className="text-xs text-muted">¿Tenés dudas? Escribinos a DropsDrops2005@gmail.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
