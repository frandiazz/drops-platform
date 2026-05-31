'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Check, X, Copy, CheckCircle, XCircle, Clock, ExternalLink, LogOut, ChevronLeft, DollarSign, ChevronRight, Inbox } from 'lucide-react';
import Logo from '@/components/Logo';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Application {
  id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  other_social: string;
  photo_urls: string[];
  experience: string;
  status: 'pending' | 'approved' | 'rejected';
  invite_token: string | null;
  created_at: string;
  reviewed_at: string | null;
}

interface PageData {
  total: number;
  page: number;
  hasMore: boolean;
}

const statusColors: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  approved: 'text-green-400 bg-green-500/10 border-green-500/30',
  rejected: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const statBadges: Record<string, { bg: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  pending: { bg: 'bg-yellow-500/10', icon: Clock, color: 'text-yellow-400' },
  approved: { bg: 'bg-green-500/10', icon: CheckCircle, color: 'text-green-400' },
  rejected: { bg: 'bg-red-500/10', icon: XCircle, color: 'text-red-400' },
};

function SkeletonCards() {
  return (
    <div className="min-h-screen bg-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-8 w-48 bg-slate-800/50 animate-pulse rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 glass rounded-xl p-4">
              <div className="w-6 h-6 bg-slate-800/50 animate-pulse rounded mx-auto mb-2" />
              <div className="h-8 w-12 bg-slate-800/50 animate-pulse rounded mx-auto mb-1" />
              <div className="h-4 w-16 bg-slate-800/30 animate-pulse rounded mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 glass rounded-xl p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-800/50 animate-pulse rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-slate-800/50 animate-pulse rounded" />
                  <div className="h-3 w-32 bg-slate-800/30 animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-96 glass rounded-2xl p-6">
            <div className="h-6 w-32 bg-slate-800/50 animate-pulse rounded mb-6" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-slate-800/30 animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<string>('pending');
  const [selected, setSelected] = useState<Application | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageData>({ total: 0, page: 0, hasMore: false });
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: 'approved' | 'rejected' } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/admin/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }
      setUser(session.user);
      setChecking(false);
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    fetchApplications();
  }, [user, filter]);

  const fetchApplications = async (page = 0) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/applications?status=${filter}&page=${page}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
        setPageData({ total: data.total || 0, page: data.page || 0, hasMore: data.hasMore || false });
      } else if (data.error) {
        addToast(data.error, 'error');
      }
    } catch {
      addToast('Error al cargar postulaciones', 'error');
    }
  };

  const handleAction = async (applicationId: string, status: 'approved' | 'rejected') => {
    setUpdating(applicationId);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setUpdating(null); return; }
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ applicationId, status }),
      });
      const data = await res.json();
      if (data.application) {
        setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, ...data.application } : a));
        if (selected?.id === applicationId) setSelected({ ...selected, ...data.application });
        addToast(status === 'approved' ? 'Postulación aprobada' : 'Postulación rechazada', 'success');
      } else {
        addToast(data.error || 'Error al procesar', 'error');
      }
    } catch {
      addToast('Error de conexión', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const copyLink = useCallback((token: string) => {
    const link = `${window.location.origin}/register?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(token);
    addToast('Link de registro copiado', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  }, [addToast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (checking) {
    return <SkeletonCards />;
  }

  return (
    <div className="min-h-screen bg-dark">
      <header className="glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted hover:text-white transition-colors" aria-label="Volver">
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Logo size={28} showText={false} />
            <h1 className="text-lg font-bold">Panel <span className="gradient-text">Admin</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/withdrawals" className="text-sm text-accent-cyan hover:text-white transition-colors flex items-center gap-1.5 py-2">
              <DollarSign className="w-4 h-4" /> Retiros
            </Link>
            <span className="text-sm text-muted hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 animate-slide-up">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {['pending', 'approved', 'rejected'].map((s) => {
            const badge = statBadges[s];
            const BadgeIcon = badge.icon;
            const count = s === filter ? pageData.total : applications.filter(a => a.status === s).length;
            return (
              <button key={s} onClick={() => { setFilter(s); setSelected(null); setPageData(prev => ({ ...prev, page: 0 })); }}
                className={`glass-card rounded-xl p-4 text-center transition-all cursor-pointer ${filter === s ? 'ring-2 ring-accent-violet' : ''}`}>
                <div className={`w-10 h-10 rounded-lg ${badge.bg} flex items-center justify-center mx-auto mb-2`}>
                  <BadgeIcon className={`w-5 h-5 ${badge.color}`} />
                </div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted capitalize">{s}</p>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Applicants list */}
          <div>
            <h2 className="text-xl font-bold mb-4 capitalize"><span className="gradient-text">{filter === 'all' ? 'Todas' : filter}</span> ({applications.length})</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {applications.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <Inbox className="w-12 h-12 text-muted mx-auto mb-4" />
                  <p className="text-muted font-medium">No hay postulaciones {filter}</p>
                  <p className="text-xs text-muted mt-1">Cuando alguien se postule, aparecerá acá.</p>
                </div>
              ) : (
                applications.map((app) => {
                  const StatusIcon = statusIcons[app.status];
                  return (
                    <div key={app.id} onClick={() => setSelected(app)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSelected(app); }}
                      className={`glass-card rounded-xl p-4 text-left transition-all cursor-pointer ${selected?.id === app.id ? 'ring-2 ring-accent-violet' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 relative">
                          {app.photo_urls?.[0] ? (
                            <Image src={app.photo_urls[0]} alt={`Foto de ${app.name}`} fill className="object-cover" sizes="56px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted">
                              {app.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{app.name}</p>
                          <p className="text-xs text-muted">{app.age} años · {app.country}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[app.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {app.status}
                            </span>
                            <span className="text-[10px] text-muted">{new Date(app.created_at).toLocaleDateString('es-AR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {(pageData.hasMore || pageData.page > 0) && applications.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button onClick={() => fetchApplications(pageData.page - 1)} disabled={pageData.page === 0}
                  className="px-4 py-2 text-sm rounded-lg glass-card hover:bg-slate-800/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  Anterior
                </button>
                <span className="text-sm text-muted">Página {pageData.page + 1}</span>
                <button onClick={() => fetchApplications(pageData.page + 1)} disabled={!pageData.hasMore}
                  className="px-4 py-2 text-sm rounded-lg glass-card hover:bg-slate-800/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">
                  Siguiente <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">{selected.name}</h2>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selected.status]}`}>
                    {(() => { const Icon = statusIcons[selected.status]; return <Icon className="w-3.5 h-3.5" />; })()}
                    {selected.status}
                  </span>
                </div>

                {/* Photos */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                  {selected.photo_urls?.map((url, i) => (
                    <div key={i} className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/50 transition-transform hover:scale-105">
                      <Image src={url} alt={`Foto ${i + 1}`} width={96} height={128} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-light/50 rounded-lg p-3 hover:bg-dark-light/70 transition-colors">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium truncate">{selected.email}</p>
                    </div>
                    <div className="bg-dark-light/50 rounded-lg p-3 hover:bg-dark-light/70 transition-colors">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Edad</p>
                      <p className="text-sm font-medium">{selected.age} años</p>
                    </div>
                    <div className="bg-dark-light/50 rounded-lg p-3 hover:bg-dark-light/70 transition-colors">
                      <p className="text-[10px] text-muted uppercase tracking-wider">País</p>
                      <p className="text-sm font-medium">{selected.country}</p>
                    </div>
                    <div className="bg-dark-light/50 rounded-lg p-3 hover:bg-dark-light/70 transition-colors">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Postulada</p>
                      <p className="text-sm font-medium">{new Date(selected.created_at).toLocaleDateString('es-AR')}</p>
                    </div>
                  </div>

                  <div className="bg-dark-light/50 rounded-lg p-3 hover:bg-dark-light/70 transition-colors">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Redes sociales</p>
                    <div className="space-y-1">
                      {selected.instagram && <p className="text-sm">IG: <span className="text-accent-cyan">@{selected.instagram}</span></p>}
                      {selected.tiktok && <p className="text-sm">TikTok: <span className="text-accent-cyan">@{selected.tiktok}</span></p>}
                      {selected.twitter && <p className="text-sm">X: <span className="text-accent-cyan">@{selected.twitter}</span></p>}
                      {selected.other_social && <p className="text-sm text-muted truncate">{selected.other_social}</p>}
                    </div>
                  </div>

                  {selected.experience && (
                    <div className="bg-dark-light/50 rounded-lg p-3 hover:bg-dark-light/70 transition-colors">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Experiencia / Motivo</p>
                      <p className="text-sm text-muted leading-relaxed">{selected.experience}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selected.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => { setConfirmAction({ id: selected.id, status: 'approved' }); }} disabled={updating === selected.id}
                      className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl neon-glow transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {updating === selected.id ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <><Check className="w-5 h-5" /> Aprobar</>
                      )}
                    </button>
                    <button onClick={() => { setConfirmAction({ id: selected.id, status: 'rejected' }); }} disabled={updating === selected.id}
                      className="flex-1 h-12 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold rounded-xl border border-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {updating === selected.id ? (
                        <span className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <><X className="w-5 h-5" /> Rechazar</>
                      )}
                    </button>
                  </div>
                )}

                {selected.status === 'approved' && selected.invite_token && (
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-green-400 mb-2">Aprobada</p>
                      <p className="text-xs text-muted mb-3">Copiá este link y enviaselo a la creadora por sus redes:</p>
                      <div className="flex gap-2">
                        <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?token=${selected.invite_token}`}
                          className="flex-1 h-11 rounded-lg bg-dark-light/80 border border-slate-700/50 px-3 text-xs text-muted truncate" />
                        <button onClick={() => copyLink(selected.invite_token!)}
                          className="h-11 px-4 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2 text-sm">
                          {copiedId === selected.invite_token ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedId === selected.invite_token ? 'Copiado' : 'Copiar'}
                        </button>
                      </div>
                    </div>
                    <a href={`/register?token=${selected.invite_token}`} target="_blank"
                      className="flex items-center justify-center gap-2 text-sm text-accent-cyan hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" /> Abrir link de registro
                    </a>
                  </div>
                )}

                {selected.status === 'rejected' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                    <p className="text-sm font-semibold text-red-400">Rechazada</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Inbox className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-muted font-medium">Seleccioná una postulación</p>
                <p className="text-xs text-muted mt-1">Los detalles aparecerán acá.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction?.status === 'approved' ? 'Aprobar postulación' : 'Rechazar postulación'}
        message={confirmAction?.status === 'approved'
          ? 'Se generará un link de invitación para que la creadora se registre. ¿Continuar?'
          : 'La postulación será marcada como rechazada. Esta acción no se puede deshacer. ¿Continuar?'}
        confirmLabel={confirmAction?.status === 'approved' ? 'Aprobar' : 'Rechazar'}
        variant={confirmAction?.status === 'rejected' ? 'danger' : 'default'}
        onConfirm={() => {
          if (!confirmAction) return;
          handleAction(confirmAction.id, confirmAction.status);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
