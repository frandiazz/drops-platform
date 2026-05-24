'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Upload, DollarSign, Settings, LogOut, Droplets, Repeat } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/content', label: 'Contenido', icon: Upload },
  { href: '/dashboard/earnings', label: 'Ganancias', icon: DollarSign },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/dashboard/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/dashboard/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/dashboard/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-pulse text-accent-cyan text-xl font-bold">Cargando...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/50 bg-dark-light/30">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-7 h-7 text-accent-cyan" viewBox="0 0 32 40" fill="none">
              <path d="M16 0C16 0 0 18 0 26C0 34.837 7.163 40 16 40C24.837 40 32 34.837 32 26C32 18 16 0 16 0Z" fill="url(#dropGrad3)"/>
              <defs><linearGradient id="dropGrad3" x1="0" y1="0" x2="32" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs>
            </svg>
            <span className="text-lg font-bold">Drops</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-800/50">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-3 py-2 text-muted hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
