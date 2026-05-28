'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { CheckCircle, Clock, XCircle, Download, Send, Image as ImageIcon, Repeat } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function AccessPage({ params }: { params: { token: string } }) {
  const [sale, setSale] = useState<any>(null);
  const [content, setContent] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Try subscription first
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('access_token', params.token)
        .maybeSingle();

      if (subData) {
        setSubscription(subData);

        // If pending, try to find linked sale and verify
        if (subData.status === 'pending') {
          const { data: linkedSale } = await supabase
            .from('sales')
            .select('*')
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
            } catch {}
          }
        }

        setSale(subData);
        if (subData.content_id) {
          const { data: contentData } = await supabase
            .from('content')
            .select('*')
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
        .select('*')
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
        } catch {}
      }

      setSale(saleData);

      if (saleData.content_id) {
        const { data: contentData } = await supabase
          .from('content')
          .select('*')
          .eq('id', saleData.content_id)
          .maybeSingle();
        if (contentData) setContent(contentData);
      }

      setLoading(false);
    };
    fetchData();
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
            <p className="text-muted mb-4">Tu suscripción venció el {new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            <p className="text-xs text-muted mb-6">Si querés renovar, contactanos a DropsDrops2005@gmail.com.</p>
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
              <p className="text-xs text-muted">Email: <span className="text-white">{subscription?.buyer_email || sale?.buyer_email}</span></p>
              <p className="text-xs text-muted mt-1">Monto: <span className="text-accent-cyan font-bold">${sale?.amount || subscription?.amount} USD</span></p>
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
            <p className="text-muted">Gracias por tu compra, {subscription?.buyer_email || sale?.buyer_email}</p>
          </div>

          {subscription && subscription.status === 'active' && !isExpired && (
            <div className={`glass-card rounded-xl p-4 mb-6 flex items-center gap-3 border ${isAboutToExpire ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
              <Repeat className={`w-5 h-5 flex-shrink-0 ${isAboutToExpire ? 'text-yellow-400' : 'text-cyan-400'}`} />
              <div>
                <p className={`text-sm font-semibold ${isAboutToExpire ? 'text-yellow-400' : 'text-cyan-400'}`}>
                  {isAboutToExpire ? 'Suscripción por vencer' : 'Suscripción activa'}
                </p>
                <p className="text-xs text-muted">
                  {isAboutToExpire
                    ? `Vence el ${new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}. Renová pronto para no perder el acceso.`
                    : `Vigente hasta ${new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}`
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
                    {content.media_urls.map((url: string, i: number) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="aspect-square rounded-xl bg-dark-light/50 border border-slate-700/50 overflow-hidden hover:border-accent-violet/50 transition-colors group relative block">
                        {url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={url} className="w-full h-full object-cover" controls preload="metadata" />
                        ) : (
                          <Image src={url} alt="Contenido" fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                      </a>
                    ))}
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

              {content.delivery_type === 'download' && content.media_urls?.length > 0 && (
                <a href={content.media_urls[0]} download
                  className="w-full flex items-center justify-center gap-2 py-3 bg-accent-violet text-white font-semibold rounded-xl neon-glow hover:bg-violet-600 transition-all">
                  <Download className="w-5 h-5" /> Descargar contenido
                </a>
              )}
            </div>
          )}

          <div className="glass-card rounded-xl p-6 text-center">
            <p className="text-xs text-muted mb-2">
              {subscription ? 'Suscripción iniciada el' : 'Compra realizada el'} {new Date(sale?.created_at).toLocaleDateString('es-AR')}
            </p>
            {subscription && (
              <p className="text-xs text-muted mb-1">
                Próximo vencimiento: {new Date(subscription.current_period_end).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            <p className="text-xs text-muted">¿Dudas? Escribinos a DropsDrops2005@gmail.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
