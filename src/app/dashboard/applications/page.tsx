'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  Users, Search, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, Mail, ExternalLink,
} from 'lucide-react';

const ADMIN_EMAIL = 'DropsDrops2005@gmail.com';

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-500/10',
  reviewing: 'text-accent-cyan bg-accent-cyan/10',
  accepted: 'text-green-400 bg-green-500/10',
  rejected: 'text-red-400 bg-red-500/10',
};

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  reviewing: 'En revisión',
  accepted: 'Aceptada',
  rejected: 'Rechazada',
};

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push('/dashboard/login');
        return;
      }
      setUser(session.user);
      await fetchApps(filter);
      setLoading(false);
    });
  }, []);

  const fetchApps = async (status: string) => {
    const res = await fetch(`/api/admin/applications?status=${status}`);
    const data = await res.json();
    if (data.applications) setApplications(data.applications);
  };

  const handleFilter = async (newFilter: string) => {
    setFilter(newFilter);
    setLoading(true);
    await fetchApps(newFilter);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await fetchApps(filter);
  };

  const updateNotes = async (id: string, admin_notes: string) => {
    await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, admin_notes }),
    });
  };

  const filtered = applications.filter((a: any) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q) || a.instagram?.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <div className="animate-pulse text-accent-cyan text-xl font-bold">Cargando...</div>
      </div>
    );
  }

  const pendingCount = applications.filter((a: any) => a.status === 'pending').length;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          <span className="gradient-text">Postulaciones</span>
        </h1>
        <p className="text-muted mt-1">
          {pendingCount > 0
            ? `Tenés ${pendingCount} postulaciones pendientes por revisar.`
            : 'No hay postulaciones pendientes.'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((s) => (
          <button key={s} onClick={() => handleFilter(s)}
            className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
              filter === s ? 'bg-accent-violet text-white' : 'glass text-muted hover:text-white'
            }`}>
            {statusLabels[s] || 'Todas'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 pl-10 pr-4 text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors"
          placeholder="Buscar por nombre, email o Instagram..." />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted text-lg">No hay postulaciones {filter !== 'all' ? `con estado "${statusLabels[filter]}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app: any) => (
            <div key={app.id} className="glass-card rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-800/30 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[app.status]?.split(' ')[0] || 'text-muted'}`} style={{ backgroundColor: 'currentColor' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{app.name}</p>
                  <p className="text-xs text-muted truncate">@{app.instagram} {app.country ? `· ${app.country}` : ''} {app.age ? `· ${app.age} años` : ''}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'text-muted bg-slate-800/50'}`}>
                  {statusLabels[app.status] || app.status}
                </span>
                {expanded === app.id ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>

              {expanded === app.id && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-800/50 pt-4">
                  {/* Photos */}
                  {app.photos?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {app.photos.map((url: string, i: number) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="w-16 h-16 rounded-lg overflow-hidden border border-slate-700/50 hover:border-accent-violet transition-colors">
                          <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted">Email:</span> <a href={`mailto:${app.email}`} className="text-accent-cyan hover:underline">{app.email}</a></div>
                    <div><span className="text-muted">Instagram:</span> <a href={`https://instagram.com/${app.instagram}`} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">@{app.instagram}</a></div>
                    {app.tiktok && <div><span className="text-muted">TikTok:</span> <a href={`https://tiktok.com/@${app.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">@{app.tiktok}</a></div>}
                    {app.twitter && <div><span className="text-muted">X:</span> <a href={`https://x.com/${app.twitter}`} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">@{app.twitter}</a></div>}
                    <div><span className="text-muted">Edad:</span> {app.age}</div>
                    <div><span className="text-muted">País:</span> {app.country}</div>
                    <div><span className="text-muted">Contenido:</span> {app.content_type}</div>
                    <div><span className="text-muted">Servicio:</span> {app.service}</div>
                    <div><span className="text-muted">Referencia:</span> {app.referral || '—'}</div>
                    <div><span className="text-muted">Recibida:</span> {new Date(app.created_at).toLocaleDateString('es-AR')}</div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">¿Por qué quiere unirse?</p>
                    <p className="text-sm text-muted bg-dark-light/50 rounded-lg p-3">{app.why_join}</p>
                  </div>

                  {app.experience && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Experiencia previa</p>
                      <p className="text-sm text-muted bg-dark-light/50 rounded-lg p-3">{app.experience}</p>
                    </div>
                  )}

                  {/* Admin notes */}
                  <div>
                    <label className="text-sm font-semibold text-muted block mb-1">Notas internas</label>
                    <textarea
                      defaultValue={app.admin_notes || ''}
                      rows={2}
                      onBlur={(e) => updateNotes(app.id, e.target.value)}
                      className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-accent-violet focus:outline-none transition-colors resize-none"
                      placeholder="Escribí tus impresiones..." />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a href={`mailto:${app.email}?subject=Drops%20-%20Tu%20postulación`}
                      className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors text-sm font-medium">
                      <Mail className="w-4 h-4" /> Contactar
                    </a>
                    {app.status !== 'accepted' && (
                      <button onClick={() => updateStatus(app.id, 'accepted')}
                        className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-medium">
                        <CheckCircle className="w-4 h-4" /> Aceptar
                      </button>
                    )}
                    {app.status !== 'rejected' && (
                      <button onClick={() => updateStatus(app.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                        <XCircle className="w-4 h-4" /> Rechazar
                      </button>
                    )}
                    {app.status === 'pending' && (
                      <button onClick={() => updateStatus(app.id, 'reviewing')}
                        className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-accent-violet/10 text-accent-violet rounded-lg hover:bg-accent-violet/20 transition-colors text-sm font-medium">
                        En revisión
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
