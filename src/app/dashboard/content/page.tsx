'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Image as ImageIcon, Plus, Pencil, Trash2, Link as LinkIcon, Check, Film } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import type { ContentPack } from '@/types';
import type { ContentFormData } from '@/components/dashboard/ContentForm';
import { useToast } from '@/components/Toast';
import type { User } from '@supabase/supabase-js';

const ContentForm = dynamic(() => import('@/components/dashboard/ContentForm'), { ssr: false });
const ConfirmDialog = dynamic(() => import('@/components/ConfirmDialog'), { ssr: false });

function firstImage(urls: string[] | null | undefined): string | null {
  if (!urls) return null;
  return urls.find(url => !/\.(mp4|webm|ogg)$/i.test(url)) || null;
}

export default function ContentPage() {
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [packs, setPacks] = useState<ContentPack[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPack, setEditingPack] = useState<ContentPack | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  const getCheckoutUrl = (pack: ContentPack) => `${siteUrl}/checkout?creatorId=${user?.id || ''}&packId=${pack.id}`;

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from('content')
          .select('id, title, description, price, delivery_type, telegram_link, media_urls, is_active, created_at, type, subscription_price')
          .eq('creator_id', session.user.id)
          .order('created_at', { ascending: false });
        if (data) setPacks(data as unknown as ContentPack[]);
      }
    });
  }, []);

  const loadPacks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('content')
      .select('id, title, description, price, delivery_type, telegram_link, media_urls, is_active, created_at, type, subscription_price')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPacks(data as unknown as ContentPack[]);
  };

  const openNewForm = () => {
    setEditingPack(null);
    setShowForm(true);
  };

  const openEditForm = useCallback((pack: ContentPack) => {
    setEditingPack(pack);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
    setEditingPack(null);
  }, []);

  const handleSave = useCallback(async (data: ContentFormData) => {
    if (!user) return;

    const parsedPrice = parseFloat(data.price);
    const parsedSubPrice = parseFloat(data.subscriptionPrice);

    if (data.contentType === 'one_time' && (isNaN(parsedPrice) || parsedPrice <= 0)) {
      addToast('El precio debe ser mayor a 0', 'error');
      return;
    }
    if (data.contentType === 'subscription' && (isNaN(parsedSubPrice) || parsedSubPrice <= 0)) {
      addToast('El precio de suscripción debe ser mayor a 0', 'error');
      return;
    }

    const payload: Partial<ContentPack> & { type?: string; subscription_price?: number | null } = {
      title: data.title,
      description: data.description,
      price: data.contentType === 'one_time' ? parsedPrice : 0,
      media_urls: data.uploadedUrls,
      delivery_type: data.deliveryType as ContentPack['delivery_type'],
      telegram_link: data.telegramLink || null,
      is_active: data.isActive,
      type: data.contentType,
      subscription_price: data.contentType === 'subscription' ? parsedSubPrice : null,
    };
    if (data.contentType === 'one_time') {
      payload.price = parsedPrice;
      payload.subscription_price = null;
    } else {
      payload.price = 0;
      payload.subscription_price = parsedSubPrice;
    }

    if (editingPack) {
      await supabase.from('content').update(payload).eq('id', editingPack.id);
    } else {
      await supabase.from('content').insert({ ...payload, creator_id: user.id });
    }

    await loadPacks();
    setShowForm(false);
    setEditingPack(null);
  }, [user, editingPack, addToast, loadPacks]);

  const handleDelete = async (packId: string) => {
    setConfirmDelete(null);
    setDeleting(true);
    await supabase.from('content').delete().eq('id', packId);
    setPacks(prev => prev.filter(p => p.id !== packId));
    setDeleting(false);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Mi <span className="gradient-text">Contenido</span>
          </h1>
          <p className="text-muted mt-1">Subí tus packs de contenido para que tus fans puedan comprarlos.</p>
        </div>
        <button onClick={openNewForm} className="px-4 py-2.5 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nuevo pack</span>
        </button>
      </div>

      <ContentForm
        key={editingPack?.id || 'new'}
        show={showForm}
        editingPack={editingPack}
        onClose={closeForm}
        onSave={handleSave}
      />

      <div className="glass-card rounded-xl overflow-hidden">
        {packs.length === 0 ? (
          <div className="p-6 text-center text-muted">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aún no subiste contenido. Hacé click en &ldquo;Nuevo pack&rdquo; para empezar.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {packs.map((pack) => (
              <div key={pack.id} className="p-4 sm:p-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-dark-light/50 border border-slate-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {(() => {
                    const img = firstImage(pack.media_urls);
                    return img ? (
                      <Image src={img} alt={pack.title} width={64} height={64} className="w-full h-full object-cover" />
                    ) : pack.media_urls?.length ? (
                      <Film className="w-6 h-6 text-muted" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted" />
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{pack.title}</p>
                  <p className="text-xs text-muted truncate">{pack.description || 'Sin descripción'}</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${pack.type === 'subscription' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-violet-500/10 text-violet-400'}`}>
                    {pack.type === 'subscription' ? `Suscripción $${pack.subscription_price}/mes` : 'Pago único'}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-accent-cyan">
                    {pack.type === 'subscription' ? `$${pack.subscription_price}/mes` : `$${pack.price}`}
                  </p>
                  <p className="text-xs text-muted">{pack.is_active ? 'Activo' : 'Inactivo'}</p>
                  <button onClick={() => { const url = getCheckoutUrl(pack); navigator.clipboard.writeText(url); setCopiedId(pack.id); setTimeout(() => setCopiedId(null), 2000); }} className="mt-2 flex items-center gap-1 text-xs text-accent-cyan hover:text-white transition-colors">
                    {copiedId === pack.id ? <><Check className="w-3 h-3" /> Copiado!</> : <><LinkIcon className="w-3 h-3" /> Copiar link</>}
                  </button>
                  <button onClick={() => openEditForm(pack)} className="mt-1 flex items-center gap-1 text-xs text-muted hover:text-white transition-colors">
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                  <button onClick={() => setConfirmDelete(pack.id)} disabled={deleting}
                    className="mt-1 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                    <Trash2 className="w-3 h-3" /> {deleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete !== null}
        title="Eliminar pack"
        message="¿Eliminar este pack? Los compradores perderán el acceso al contenido."
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
