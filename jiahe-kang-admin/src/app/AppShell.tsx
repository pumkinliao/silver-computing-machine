import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderBar } from '../components/HeaderBar';
import { Sidebar } from '../components/Sidebar';
import { cn } from '../lib/cn';

export default function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="min-h-dvh bg-jhk-bg">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1600px]">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        <div
          className={cn(
            'fixed inset-0 z-30 lg:hidden',
            mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
          )}
          aria-hidden={!mobileOpen}
        >
          <div
            className={cn(
              'absolute inset-0 bg-slate-900/30 transition-opacity',
              mobileOpen ? 'opacity-100' : 'opacity-0',
            )}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              'absolute left-0 top-0 h-full w-80 max-w-[86vw] transform transition',
              mobileOpen ? 'translate-x-0' : '-translate-x-full',
            )}
          >
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <HeaderBar onOpenSidebar={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

