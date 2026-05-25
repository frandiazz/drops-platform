'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, X, Pencil } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContentPage() {
  const [user, setUser] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('25');
  const [deliveryType, setDeliveryType] = useState('download');
  const [telegramLink, setTelegramLink] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPack, setEditingPack] = useState<any>(null);
  const [isActive, setIsActive] = useState(true);
  const [contentType, setContentType] = useState<'one_time' | 'subscription'>('one_time');
  const [subscriptionPrice, setSubscriptionPrice] = useState('25');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        const { data } = await supabase
          .from('content')
          .select('*')
          .eq('creator_id', session.user.id)
          .order('created_at', { ascending: false });
        if (data) setPacks(data);
      }
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        if (data.url) {
          setUploadedUrls((prev) => [...prev, data.url]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      files.forEach(handleFileUpload);
    },
    [handleFileUpload]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) Array.from(files).forEach(handleFileUpload);
  };

  const loadPacks = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('content')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setPacks(data);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPrice('25');
    setDeliveryType('download');
    setTelegramLink('');
    setUploadedUrls([]);
    setIsActive(true);
    setContentType('one_time');
    setSubscriptionPrice('25');
    setEditingPack(null);
  };

  const openNewForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (pack: any) => {
    setEditingPack(pack);
    setTitle(pack.title);
    setDescription(pack.description || '');
    setPrice(pack.price.toString());
    setDeliveryType(pack.delivery_type || 'download');
    setTelegramLink(pack.telegram_link || '');
    setUploadedUrls(pack.media_urls || []);
    setIsActive(pack.is_active !== false);
    setContentType(pack.type || 'one_time');
    setSubscriptionPrice(pack.subscription_price?.toString() || pack.price.toString());
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!user) return;
    const payload: any = {
      title,
      description,
      price: contentType === 'one_time' ? parseFloat(price) : 0,
      media_urls: uploadedUrls,
      delivery_type: deliveryType,
      telegram_link: telegramLink || null,
      is_active: isActive,
      type: contentType,
      subscription_price: contentType === 'subscription' ? parseFloat(subscriptionPrice) : null,
    };
    if (contentType === 'one_time') {
      payload.price = parseFloat(price);
      payload.subscription_price = null;
    } else {
      payload.price = 0;
      payload.subscription_price = parseFloat(subscriptionPrice);
    }
    if (editingPack) {
      await supabase.from('content').update(payload).eq('id', editingPack.id);
    } else {
      await supabase.from('content').insert({ ...payload, creator_id: user.id });
    }
    await loadPacks();
    setShowForm(false);
    resetForm();
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
        <button
          onClick={openNewForm}
          className="px-4 py-2.5 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nuevo pack</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-4 sm:p-8 w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingPack ? 'Editar pack' : 'Nuevo pack de contenido'}</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none"
                  placeholder="Premium Pack #1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-2">Descripción</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white focus:border-accent-violet focus:outline-none resize-none"
                  placeholder="Descripción del contenido"
                />
              </div>

              {/* Type toggle */}
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Tipo de pack</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-dark-light/60 border border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => { setContentType('one_time'); if (price === '0') setPrice('25'); }}
                    className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all ${contentType === 'one_time' ? 'bg-accent-violet text-white' : 'text-muted hover:text-white'}`}
                  >
                    Pago único
                  </button>
                  <button
                    type="button"
                    onClick={() => { setContentType('subscription'); if (subscriptionPrice === '25') setSubscriptionPrice('9.99'); }}
                    className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all ${contentType === 'subscription' ? 'bg-accent-cyan text-white' : 'text-muted hover:text-white'}`}
                  >
                    Suscripción mensual
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    {contentType === 'one_time' ? 'Precio (USD)' : 'Precio único (USD)'}
                  </label>
                  {contentType === 'one_time' ? (
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none"
                    />
                  ) : (
                    <div className="w-full h-12 rounded-lg bg-dark-light/40 border border-slate-700/30 px-4 flex items-center text-muted text-sm">
                      Sin precio único (suscripción)
                    </div>
                  )}
                </div>
                {contentType === 'subscription' && (
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">Precio mensual (USD)</label>
                    <input
                      type="number"
                      value={subscriptionPrice}
                      onChange={(e) => setSubscriptionPrice(e.target.value)}
                      className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-cyan focus:outline-none"
                      placeholder="9.99"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Tipo de entrega</label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none appearance-none"
                  >
                    <option value="download">Descarga directa</option>
                    <option value="telegram">Acceso a Telegram</option>
                    <option value="both">Ambos</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-muted">{isActive ? 'Activo' : 'Inactivo'}</span>
              </div>

              {deliveryType !== 'download' && (
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Link de Telegram</label>
                  <input
                    type="url"
                    value={telegramLink}
                    onChange={(e) => setTelegramLink(e.target.value)}
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none"
                    placeholder="https://t.me/..."
                  />
                </div>
              )}

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragOver ? 'border-accent-cyan bg-accent-cyan/5' : 'border-slate-700/50'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-accent-violet mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Subir archivos</p>
                <p className="text-xs text-muted mb-3">Arrastrá o hacé click</p>
                <label className="inline-flex px-4 py-2 bg-accent-violet/20 text-accent-violet rounded-lg cursor-pointer hover:bg-accent-violet/30 transition-colors text-sm font-medium">
                  Seleccionar
                  <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>

              {/* Uploaded files */}
              {uploadedUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted">Archivos subidos:</p>
                  {uploadedUrls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-dark-light/50">
                      <ImageIcon className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                      <span className="text-xs text-muted truncate flex-1">{url}</span>
                      <button onClick={() => setUploadedUrls((prev) => prev.filter((_, idx) => idx !== i))} className="p-1 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploading && <p className="text-sm text-accent-cyan animate-pulse">Subiendo archivos...</p>}

              <button
                onClick={handleSave}
                disabled={!title || uploadedUrls.length === 0}
                className="w-full py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all disabled:opacity-50"
              >
                Guardar pack
              </button>

              <p className="text-xs text-muted text-center">
                Nota: Si la entrega es por fuera de la app, Drops no se hace responsable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
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
                  {pack.media_urls?.[0] ? (
                    <img src={pack.media_urls[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted" />
                  )}
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
                  <button onClick={() => openEditForm(pack)} className="mt-2 flex items-center gap-1 text-xs text-muted hover:text-white transition-colors">
                    <Pencil className="w-3 h-3" /> Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
