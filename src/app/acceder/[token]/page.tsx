'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { XCircle, Clock, CheckCircle, Repeat, ImageIcon, Download, Send } from 'lucide-react';
import type { Sale, Subscription, ContentPack } from '@/types';

export default function AccessPage({ params }: { params: { token: string } }) {
  const [sale, setSale] = useState<Sale | null>(null);
  const [content, setContent] = useState<Partial<ContentPack> | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signedUrls, setSignedUrls] = useState<string[]>([]);
  const [downloading, setDownloading] = useState(false);

  const downloadFile = async (url: string, index: number) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = url.split('.').pop()?.split(/[?#]/)[0] || 'file';
      const filename = `${content?.title || 'contenido'}_${index + 1}.${ext}`;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const downloadAll = async () => {
    const urls = signedUrls.length > 0 ? signedUrls : (content?.media_urls || []);
    if (urls.length === 0) return;
    setDownloading(true);
    for (let i = 0; i < urls.length; i++) {
      await downloadFile(urls[i], i);
      await new Promise(r => setTimeout(r, 800));
    }
    setDownloading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Try subscription first
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('id, status, current_period_end, buyer_email, content_id, created_at, amount')
        .eq('access_token', params.token)
        .maybeSingle();

      if (subData) {
        setSubscription(subData);

        // If pending, try to find linked sale and verify
        if (subData.status === 'pending') {
          const { data: linkedSale } = await supabase
            .from('sales')
            .select('id, payment_status, buyer_email, content_id, mp_payment_id')
            .eq('buyer_email', subData.buyer_email)
            .eq('content_id', subData.content_id)
            .eq('payment_status', 'pending')
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (linkedSale) {
            try {
              const res = await fetch(`/api/verify-payment?sale_id=${linkedSale.id}`);
              const result = await res.json();
              if (result.success) {
                linkedSale.payment_status = 'completed';
                await supabase.from('subscriptions').update({ status: 'active' }).eq('id', subData.id);
                subData.status = 'active';
              }
            } catch (err2) { console.error('Verify payment error:', err2); }
          }
        }

        if (subData.content_id) {
          const { data: contentData } = await supabase
            .from('content')
            .select('id, title, description, media_urls, delivery_type, telegram_link')
            .eq('id', subData.content_id)
            .maybeSingle();
          if (contentData) setContent(contentData);
        }
        setLoading(false);
        return;
      }

      // Fallback to sale (backward compat)
      const { data: saleData, error: saleError } = await supabase
        .from('sales')
        .select('id, payment_status, amount, created_at, buyer_email, content_id, mp_payment_id')
        .eq('access_token', params.token)
        .maybeSingle();

      if (saleError || !saleData) {
        setError('Link inválido o expirado');
        setLoading(false);
        return;
      }

      // If still pending, verify with MP
      if (saleData.payment_status === 'pending') {
        try {
          const res = await fetch(`/api/verify-payment?sale_id=${saleData.id}`);
          const result = await res.json();
          if (result.success) {
            saleData.payment_status = 'completed';
          }
        } catch (err2) { console.error('Verify pending payment error:', err2); }
      }

      setSale(saleData);

      if (saleData.content_id) {
        const { data: contentData } = await supabase
          .from('content')
          .select('id, title, description, media_urls, delivery_type, telegram_link')
          .eq('id', saleData.content_id)
          .maybeSingle();
        if (contentData) setContent(contentData);
      }

      setLoading(false);
    };
    fetchData();
  }, [params.token]);

  // Fetch signed URLs when content is loaded
  useEffect(() => {
    if (content?.media_urls?.length) {
      fetch(`/api/signed-content?token=${params.token}`)
        .then(res => res.json())
        .then(data => {
          if (data.urls) setSignedUrls(data.urls);
        })
        .catch(() => {});
    }
  }, [content, params.token]);

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

  const now = new Date();
  const isExpired = subscription?.status === 'active' && subscription?.current_period_end && new Date(subscription.current_period_end) < now;
  const isAboutToExpire = subscription?.status === 'active' && subscription?.current_period_end &&
    !isExpired && (new Date(subscription.current_period_end).getTime() - now.getTime()) < 3 * 24 * 60 * 60 * 1000;
  const isCompleted = subscription ? (subscription.status === 'active' && !isExpired) : sale?.payment_status === 'completed';
  const status = subscription ? subscription.status : sale?.payment_status;

  if (isExpired) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Clock className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-2">Suscripción expirada</h1>
            <p className="text-muted mb-4">Tu suscripción venció el {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}.</p>
            <p className="text-xs text-muted mb-6"><a href="mailto:hola@drops.agency" className="text-accent-cyan hover:underline">Contactanos</a> para renovar.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              <p className="text-xs text-muted">Monto: <span className="text-accent-cyan font-bold">${sale?.amount || subscription?.amount} USD</span></p>
            </div>
            <p className="text-xs text-muted">Si ya pagaste, refrescá la página o esperá unos segundos.</p>
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
            <p className="text-muted">Gracias por tu compra</p>
          </div>

          {subscription && subscription.status === 'active' && !isExpired && (
            <div className={`glass-card rounded-xl p-4 mb-6 flex items-center gap-3 border ${isAboutToExpire ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
              <Repeat className={`w-5 h-5 flex-shrink-0 ${isAboutToExpire ? 'text-yellow-400' : 'text-cyan-400'}`} />
              <div>
                <p className={`text-sm font-semibold ${isAboutToExpire ? 'text-yellow-400' : 'text-cyan-400'}`}>
                  {isAboutToExpire ? 'Suscripción por vencer' : 'Suscripción activa'}
                </p>
                <p className="text-xs text-muted">
                  {subscription.current_period_end
                    ? (isAboutToExpire
                      ? `Vence el ${new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}. Renová pronto para no perder el acceso.`
                      : `Vigente hasta ${new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}`)
                    : '—'
                  }
                </p>
              </div>
            </div>
          )}

          {content && (
            <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-bold mb-4">{content.title}</h2>
              {content.description && <p className="text-muted text-sm mb-4">{content.description}</p>}

              {content.media_urls && content.media_urls.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-muted mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Archivos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {content.media_urls.map((url: string, i: number) => {
                      const displayUrl = signedUrls[i] || url;
                      return (
                      <div key={i} className="aspect-square rounded-xl bg-dark-light/50 border border-slate-700/50 overflow-hidden hover:border-accent-violet/50 transition-colors group relative">
                        <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          {url.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={displayUrl} className="w-full h-full object-cover" controls preload="metadata" />
                          ) : (
                            <Image src={displayUrl} alt="Contenido" fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                          )}
                        </a>
                        <button onClick={() => downloadFile(displayUrl, i)}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity w-full h-full cursor-pointer">
                          <Download className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {content.telegram_link && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 mb-4">
                  <div className="flex items-start gap-3">
                    <Send className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold mb-1">Acceso a Telegram</p>
                      <p className="text-xs text-muted mb-3">Unite al grupo privado:</p>
                      <a href={content.telegram_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors">
                        <Send className="w-4 h-4" /> Unirse al grupo
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {content.media_urls && content.media_urls.length > 0 && (
                <button onClick={downloadAll} disabled={downloading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent-violet text-white font-semibold rounded-xl neon-glow hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                  <Download className="w-5 h-5" /> {downloading ? `Descargando... (${signedUrls.length || content.media_urls.length} archivos)` : `Descargar todo (${signedUrls.length || content.media_urls.length} archivos)`}
                </button>
              )}
            </div>
          )}

          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-xs text-muted mb-2">
              {subscription ? 'Suscripción iniciada el' : 'Compra realizada el'} {(subscription?.created_at || sale?.created_at) ? new Date(subscription?.created_at || sale!.created_at).toLocaleDateString('es-AR') : '—'}
            </p>
            {subscription && (
              <p className="text-xs text-muted mb-1">
                Próximo vencimiento: {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            )}
            <p className="text-xs text-muted">¿Dudas? <a href="mailto:hola@drops.agency" className="text-accent-cyan hover:underline">Contactanos</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
