'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LogoutButton from './LogoutButton';
import type { Page } from '@/lib/types';

export default function Navbar({ userName, isLoggedIn }: { userName?: string; isLoggedIn?: boolean }) {
  const [navPages, setNavPages] = useState<Page[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('pages')
        .select('*')
        .eq('is_published', true)
        .eq('show_in_nav', true)
        .order('nav_order', { ascending: true });
      setNavPages((data || []) as Page[]);
    })();
  }, []);

  function hrefFor(page: Page) {
    return page.is_home ? '/' : `/${page.slug}`;
  }

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-extrabold text-[var(--brand-600)]">
          Prox System
        </Link>

        {navPages.length > 0 && (
          <nav className="hidden gap-4 sm:flex">
            {navPages.map((p) => (
              <Link
                key={p.id}
                href={hrefFor(p)}
                className={`text-sm font-medium ${pathname === hrefFor(p) ? 'text-[var(--brand-600)]' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {p.title}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">Hola, {userName || 'usuario'}</span>
              <LogoutButton />
            </>
          ) : (
            <Link href="/login" className="btn-secondary py-1.5 text-xs">
              Iniciar sesión
            </Link>
          )}
          {navPages.length > 0 && (
            <button onClick={() => setMenuOpen((s) => !s)} className="text-lg sm:hidden" aria-label="Menú">
              ☰
            </button>
          )}
        </div>
      </div>

      {menuOpen && navPages.length > 0 && (
        <nav className="flex flex-col gap-1 border-t border-slate-100 px-4 py-2 sm:hidden">
          {navPages.map((p) => (
            <Link
              key={p.id}
              href={hrefFor(p)}
              onClick={() => setMenuOpen(false)}
              className={`rounded-lg px-2 py-2 text-sm font-medium ${pathname === hrefFor(p) ? 'bg-[var(--brand-50)] text-[var(--brand-600)]' : 'text-slate-600'}`}
            >
              {p.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
