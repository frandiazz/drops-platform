'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Mail, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [stageName, setStageName] = useState('');
  const [socials, setSocials] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        setStageName(session.user.user_metadata?.stage_name || '');
        setSocials(session.user.user_metadata?.socials || '');
      }
    });
  }, []);

  const handleSave = async () => {
    await supabase.auth.updateUser({
      data: { stage_name: stageName, socials },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold">
          <span className="gradient-text">Configuración</span>
        </h1>
        <p className="text-muted mt-1">Gestioná tu perfil y preferencias.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profile */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-accent-violet" />
            Perfil
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Email</label>
              <div className="flex items-center gap-2 h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-muted">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
            <div>
              <label htmlFor="stageName" className="block text-sm font-medium text-muted mb-2">Nombre artístico</label>
              <input
                id="stageName"
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                className="w-full h-12 rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 text-white focus:border-accent-violet focus:outline-none transition-colors"
                placeholder="Tu nombre artístico"
              />
            </div>
            <div>
              <label htmlFor="socials" className="block text-sm font-medium text-muted mb-2">Redes sociales</label>
              <textarea
                id="socials"
                rows={3}
                value={socials}
                onChange={(e) => setSocials(e.target.value)}
                className="w-full rounded-lg bg-dark-light/80 border border-slate-700/50 px-4 py-3 text-white focus:border-accent-violet focus:outline-none transition-colors resize-none"
                placeholder="Instagram: @tuusuario&#10;TikTok: @tuusuario"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-accent-violet text-white font-semibold rounded-lg neon-glow hover:bg-violet-600 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saved ? 'Guardado!' : 'Guardar cambios'}
            </button>
          </div>
        </div>

        {/* Service Level */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-cyan" />
            Nivel de servicio
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Full Management', desc: 'Manejamos todo: IG, X, Threads, TikTok, Telegram', commission: '50%', active: false },
              { label: 'Social Media Only', desc: 'Manejamos redes, vos manejás Telegram', commission: '30%', active: false },
              { label: 'Solo Plataforma', desc: 'Usás Drops, hacés todo sola', commission: '20%', active: true },
            ].map((plan, i) => (
              <div key={i} className={`p-4 rounded-lg border transition-colors ${plan.active ? 'border-accent-violet bg-accent-violet/5' : 'border-slate-700/50 bg-dark-light/30'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{plan.label}</p>
                    <p className="text-xs text-muted">{plan.desc}</p>
                  </div>
                  <span className={`text-sm font-bold ${plan.active ? 'text-accent-violet' : 'text-muted'}`}>{plan.commission}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted mt-4">
            Para cambiar tu nivel de servicio, contactanos a DropsDrops2005@gmail.com
          </p>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-xl p-6 border-red-500/20">
          <h3 className="text-lg font-bold mb-4 text-red-400">Zona de peligro</h3>
          <p className="text-sm text-muted mb-4">Al eliminar tu cuenta, perderás acceso a todo tu contenido y ganancias pendientes.</p>
          <button className="px-6 py-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium">
            Eliminar cuenta
          </button>
        </div>
      </div>
    </div>
  );
}
