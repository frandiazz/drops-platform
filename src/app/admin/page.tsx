'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check, X, Copy, CheckCircle, XCircle, Clock, ExternalLink, LogOut, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

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

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<string>('pending');
  const [selected, setSelected] = useState<Application | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    const token = localStorage.getItem('supabase.auth.token');
    if (!token) return;

    const session = JSON.parse(atob(token.split('.')[1]));
    const accessToken = session?.sub;

    fetchApplications(accessToken);
  }, [user, filter]);

  const getAccessToken = (): string | null => {
    try {
      const raw = localStorage.getItem('sb-njonqnmeyrutnxumxegl-auth-token');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.access_token || null;
    } catch { return null; }
  };

  const fetchApplications = async (token: string) => {
    const res = await fetch(`/api/admin/applications?status=${filter}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.applications) setApplications(data.applications);
  };

  const handleAction = async (applicationId: string, status: 'approved' | 'rejected') => {
    const token = getAccessToken();
    if (!token) return;

    const res = await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ applicationId, status }),
    });

    const data = await res.json();
    if (data.application) {
      setApplications(prev => prev.map(a => a.id === applicationId ? data.application : a));
      if (selected?.id === applicationId) setSelected(data.application);
    }
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/register?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const totalByStatus = (status: string) => applications.filter(a => a.status === status).length;

  if (checking) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-accent-cyan text-xl font-bold">Verificando acceso...</div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    approved: 'text-green-400 bg-green-500/10 border-green-500/30',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/30',
  };
  const statusIcons: Record<string, any> = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="glass border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <svg className="w-7 h-7 text-accent-cyan" viewBox="0 0 32 40" fill="none">
              <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropAdmin2)"/>
              <defs><linearGradient id="dropAdmin2" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
            </svg>
            <h1 className="text-lg font-bold">Panel Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">{user?.email}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2">
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['pending', 'approved', 'rejected'].map((s) => {
            const Icon = statusIcons[s];
            return (
              <button key={s} onClick={() => { setFilter(s); setSelected(null); }}
                className={`glass rounded-xl p-4 text-center transition-all ${filter === s ? 'ring-2 ring-accent-violet' : 'hover:bg-slate-800/30'}`}>
                <Icon className={`w-6 h-6 mx-auto mb-1 ${s === 'pending' ? 'text-yellow-400' : s === 'approved' ? 'text-green-400' : 'text-red-400'}`} />
                <p className="text-2xl font-bold">{totalByStatus(s)}</p>
                <p className="text-xs text-muted capitalize">{s}</p>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Applicants list */}
          <div>
            <h2 className="text-xl font-bold mb-4 capitalize">{filter === 'all' ? 'Todas' : filter} ({applications.length})</h2>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              {applications.length === 0 && (
                <p className="text-muted text-sm py-8 text-center">No hay postulaciones {filter}</p>
              )}
              {applications.map((app) => {
                const StatusIcon = statusIcons[app.status];
                return (
                  <button key={app.id} onClick={() => setSelected(app)}
                    className={`w-full glass rounded-xl p-4 text-left transition-all ${selected?.id === app.id ? 'ring-2 ring-accent-violet' : 'hover:bg-slate-800/30'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                        {app.photo_urls?.[0] ? (
                          <img src={app.photo_urls[0]} alt="" className="w-full h-full object-cover" />
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
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail */}
          <div>
            {selected ? (
              <div className="glass rounded-2xl p-6">
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
                    <div key={i} className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/50">
                      <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-light/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium truncate">{selected.email}</p>
                    </div>
                    <div className="bg-dark-light/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Edad</p>
                      <p className="text-sm font-medium">{selected.age} años</p>
                    </div>
                    <div className="bg-dark-light/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted uppercase tracking-wider">País</p>
                      <p className="text-sm font-medium">{selected.country}</p>
                    </div>
                    <div className="bg-dark-light/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted uppercase tracking-wider">Postulada</p>
                      <p className="text-sm font-medium">{new Date(selected.created_at).toLocaleDateString('es-AR')}</p>
                    </div>
                  </div>

                  <div className="bg-dark-light/50 rounded-lg p-3">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-2">Redes sociales</p>
                    <div className="space-y-1">
                      {selected.instagram && <p className="text-sm">IG: <span className="text-accent-cyan">@{selected.instagram}</span></p>}
                      {selected.tiktok && <p className="text-sm">TikTok: <span className="text-accent-cyan">@{selected.tiktok}</span></p>}
                      {selected.twitter && <p className="text-sm">X: <span className="text-accent-cyan">@{selected.twitter}</span></p>}
                      {selected.other_social && <p className="text-sm text-muted truncate">{selected.other_social}</p>}
                    </div>
                  </div>

                  {selected.experience && (
                    <div className="bg-dark-light/50 rounded-lg p-3">
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Experiencia / Motivo</p>
                      <p className="text-sm text-muted leading-relaxed">{selected.experience}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selected.status === 'pending' && (
                  <div className="flex gap-3">
                    <button onClick={() => handleAction(selected.id, 'approved')}
                      className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" /> Aprobar
                    </button>
                    <button onClick={() => handleAction(selected.id, 'rejected')}
                      className="flex-1 h-12 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-bold rounded-xl border border-red-500/30 transition-all flex items-center justify-center gap-2">
                      <X className="w-5 h-5" /> Rechazar
                    </button>
                  </div>
                )}

                {selected.status === 'approved' && selected.invite_token && (
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-green-400 mb-2">✓ Aprobada</p>
                      <p className="text-xs text-muted mb-3">Copiá este link y enviaselo a la creadora por sus redes:</p>
                      <div className="flex gap-2">
                        <input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/register?token=${selected.invite_token}`}
                          className="flex-1 h-11 rounded-lg bg-dark-light/80 border border-slate-700/50 px-3 text-xs text-muted truncate" />
                        <button onClick={() => copyLink(selected.invite_token!)}
                          className="h-11 px-4 bg-accent-violet text-white font-semibold rounded-lg hover:bg-violet-600 transition-all flex items-center gap-2 text-sm">
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
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted">Seleccioná una postulación para ver los detalles</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
