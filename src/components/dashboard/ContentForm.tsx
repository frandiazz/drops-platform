'use client';

import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, Trash2, Plus, X, Film, FileText } from 'lucide-react';

interface ContentFormProps {
  show: boolean;
  editingPack: { id: string; title: string; description?: string | null; price: number; delivery_type?: string | null; telegram_link?: string | null; media_urls?: string[] | null; is_active?: boolean | null; type?: 'one_time' | 'subscription' | null; subscription_price?: number | null } | null;
  onClose: () => void;
  onSave: (data: ContentFormData) => void;
  accessToken?: string;
}

export interface ContentFormData {
  title: string;
  description: string;
  price: string;
  deliveryType: string;
  telegramLink: string;
  uploadedUrls: string[];
  isActive: boolean;
  contentType: 'one_time' | 'subscription';
  subscriptionPrice: string;
}

const MAX_IMG_SIZE = 50 * 1024 * 1024;
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;

function fileIcon(type: string) {
  if (type.startsWith('video/')) return Film;
  if (type === 'application/pdf') return FileText;
  return ImageIcon;
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

export default function ContentForm({ show, editingPack, onClose, onSave, accessToken }: ContentFormProps) {
  const [title, setTitle] = useState(editingPack?.title || '');
  const [description, setDescription] = useState(editingPack?.description || '');
  const [price, setPrice] = useState(editingPack?.price.toString() || '25');
  const [deliveryType, setDeliveryType] = useState(editingPack?.delivery_type || 'download');
  const [telegramLink, setTelegramLink] = useState(editingPack?.telegram_link || '');
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(editingPack?.media_urls || []);
  const [isActive, setIsActive] = useState(editingPack?.is_active !== false);
  const [contentType, setContentType] = useState<'one_time' | 'subscription'>(editingPack?.type || 'one_time');
  const [subscriptionPrice, setSubscriptionPrice] = useState(editingPack?.subscription_price?.toString() || editingPack?.price.toString() || '25');
  const [dragOver, setDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; size: string }[]>([]);

  const handleFileUpload = useCallback(async (file: File) => {
    const maxSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_IMG_SIZE;
    if (file.size > maxSize) {
      const label = file.type.startsWith('video/') ? '500MB' : '50MB';
      alert(`"${file.name}" es muy grande (máx ${label})`);
      return;
    }

    setUploadingFiles(prev => [...prev, { name: file.name, size: formatSize(file.size) }]);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'content');
      const headers: Record<string, string> = {};
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
      const res = await fetch('/api/upload-file', {
        method: 'POST',
        headers,
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setUploadedUrls((prev) => [...prev, data.url]);
      } else {
        alert(data.error || 'Error al subir archivo');
      }
    } catch {
      alert('Error de conexión al subir archivo');
    } finally {
      setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
    }
  }, [accessToken]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(handleFileUpload);
  }, [handleFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach(handleFileUpload);
  };

  const handleSubmit = () => {
    onSave({
      title,
      description,
      price,
      deliveryType,
      telegramLink,
      uploadedUrls,
      isActive,
      contentType,
      subscriptionPrice,
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div role="dialog" aria-modal="true" aria-label={editingPack ? 'Editar pack' : 'Nuevo pack'} className="glass-card rounded-2xl p-4 sm:p-8 w-full max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{editingPack ? 'Editar pack' : 'Nuevo pack de contenido'}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="p-3 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none"
              placeholder="Premium Pack #1" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white focus:border-accent-violet focus:outline-none resize-none"
              placeholder="Descripción del contenido" />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Tipo de pack</label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-dark-light/60 border border-slate-700/50">
              <button type="button" onClick={() => { setContentType('one_time'); if (price === '0') setPrice('25'); }}
                className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all ${contentType === 'one_time' ? 'bg-accent-violet text-white' : 'text-muted hover:text-white'}`}>
                Pago único
              </button>
              <button type="button" onClick={() => { setContentType('subscription'); if (subscriptionPrice === '25') setSubscriptionPrice('9.99'); }}
                className={`py-2.5 px-4 rounded-md text-sm font-medium transition-all ${contentType === 'subscription' ? 'bg-accent-cyan text-white' : 'text-muted hover:text-white'}`}>
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
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none" />
              ) : (
                <div className="w-full h-12 rounded-lg bg-dark-light/40 border border-slate-700/30 px-4 flex items-center text-muted text-sm">
                  Sin precio único (suscripción)
                </div>
              )}
            </div>
            {contentType === 'subscription' && (
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Precio mensual (USD)</label>
                <input type="number" value={subscriptionPrice} onChange={(e) => setSubscriptionPrice(e.target.value)}
                  className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-cyan focus:outline-none"
                  placeholder="9.99" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Tipo de entrega</label>
              <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none appearance-none">
                <option value="download">Descarga directa</option>
                <option value="telegram">Acceso a Telegram</option>
                <option value="both">Ambos</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsActive(!isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-slate-600'}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isActive ? 'translate-x-5' : ''}`} />
            </button>
            <span className="text-sm text-muted">{isActive ? 'Activo' : 'Inactivo'}</span>
          </div>

          {deliveryType !== 'download' && (
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Link de Telegram</label>
              <input type="url" value={telegramLink} onChange={(e) => setTelegramLink(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none"
                placeholder="https://t.me/..." />
            </div>
          )}

          <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${dragOver ? 'border-accent-cyan bg-accent-cyan/5' : 'border-slate-700/50'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}>
            <Upload className="w-8 h-8 text-accent-violet mx-auto mb-3" />
            <p className="text-sm font-medium mb-1">Subir archivos</p>
            <p className="text-xs text-muted mb-3">Imágenes hasta 50MB · Videos hasta 500MB</p>
            <label className="inline-flex px-4 py-2 bg-accent-violet/20 text-accent-violet rounded-lg cursor-pointer hover:bg-accent-violet/30 transition-colors text-sm font-medium">
              Seleccionar
              <input type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>

          {uploadedUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted">Archivos subidos ({uploadedUrls.length})</p>
              {uploadedUrls.map((url, i) => {
                const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
                const Icon = isVideo ? Film : ImageIcon;
                return (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-dark-light/50">
                    <Icon className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                    <span className="text-xs text-muted truncate flex-1">{url.split('/').pop() || url}</span>
                    <button onClick={() => setUploadedUrls((prev) => prev.filter((_, idx) => idx !== i))} className="p-1 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {uploadingFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-accent-cyan font-medium">Subiendo archivos...</p>
              {uploadingFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-dark-light/50">
                  <div className="w-4 h-4 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin flex-shrink-0" />
                  <span className="text-xs text-muted truncate flex-1">{f.name}</span>
                  <span className="text-[10px] text-muted">{f.size}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={handleSubmit} disabled={!title || uploadedUrls.length === 0 || uploadingFiles.length > 0}
            className="w-full py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all disabled:opacity-50">
            Guardar pack
          </button>

          <p className="text-xs text-muted text-center">Nota: Si la entrega es por fuera de la app, Drops no se hace responsable.</p>
        </div>
      </div>
    </div>
  );
}
