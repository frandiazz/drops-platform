'use client';

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Trash2, ExternalLink, Plus, X } from 'lucide-react';

export default function ContentPage() {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('25');
  const [deliveryType, setDeliveryType] = useState('download');
  const [telegramLink, setTelegramLink] = useState('');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  const handleSave = async () => {
    // TODO: Save to Supabase
    console.log({ title, description, price, deliveryType, telegramLink, uploadedUrls });
    setShowForm(false);
    setTitle('');
    setDescription('');
    setPrice('25');
    setUploadedUrls([]);
    setTelegramLink('');
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
          onClick={() => setShowForm(true)}
          className="px-4 py-2.5 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nuevo pack</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Nuevo pack de contenido</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Precio (USD)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none"
                  />
                </div>
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
        <div className="p-6 text-center text-muted">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aún no subiste contenido. Hacé click en &ldquo;Nuevo pack&rdquo; para empezar.</p>
        </div>
      </div>
    </div>
  );
}
