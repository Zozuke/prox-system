'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Page } from '@/lib/types';
import Link from 'next/link';
import DragList from '@/components/admin/DragList';

export default function AdminPagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from('pages').select('*').order('nav_order', { ascending: true });
    setPages((data || []) as Page[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async function createPage(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    const slug = slugify(newTitle) || `pagina-${Date.now()}`;
    await supabase.from('pages').insert({ title: newTitle, slug, is_published: true, nav_order: pages.length });
    setNewTitle('');
    setCreating(false);
    load();
  }

  async function togglePublish(page: Page) {
    await supabase.from('pages').update({ is_published: !page.is_published }).eq('id', page.id);
    load();
  }

  async function toggleNav(page: Page) {
    await supabase.from('pages').update({ show_in_nav: !page.show_in_nav }).eq('id', page.id);
    load();
  }

  async function setAsHome(page: Page) {
    if (page.is_home) return;
    await supabase.from('pages').update({ is_home: false }).neq('id', page.id);
    await supabase.from('pages').update({ is_home: true, is_published: true }).eq('id', page.id);
    load();
  }

  async function deletePage(page: Page) {
    if (!confirm(`¿Borrar la página "${page.title}"? Esto también borrará sus bloques.`)) return;
    await supabase.from('pages').delete().eq('id', page.id);
    load();
  }

  async function handleReorder(newPages: Page[]) {
    setPages(newPages);
    await Promise.all(newPages.map((p, i) => supabase.from('pages').update({ nav_order: i }).eq('id', p.id)));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Páginas</h1>
          <p className="text-sm text-slate-500">Crea, ordena (arrastra) y administra las páginas de tu sitio.</p>
        </div>
      </div>

      <form onSubmit={createPage} className="card-surface mb-6 flex gap-3">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nombre de la nueva página (ej: Promociones)"
          className="input-field flex-1"
        />
        <button type="submit" disabled={creating} className="btn-primary whitespace-nowrap">
          + Crear página
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando…</p>
      ) : pages.length === 0 ? (
        <p className="text-sm text-slate-400">Aún no hay páginas. Crea la primera arriba.</p>
      ) : (
        <DragList
          items={pages}
          getId={(p) => p.id}
          onReorder={handleReorder}
          renderItem={(page, drag) => (
            <div className="card-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span {...drag} className="cursor-grab select-none text-slate-300 active:cursor-grabbing">⠿⠿</span>
                <div>
                  <p className="font-semibold">
                    {page.title}{' '}
                    {page.is_home && <span className="ml-2 rounded-full bg-[var(--brand-50)] px-2 py-0.5 text-[11px] font-bold text-[var(--brand-600)]">INICIO</span>}
                  </p>
                  <p className="text-xs text-slate-400">/{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAsHome(page)}
                  title="Usar esta página como inicio del sitio"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${page.is_home ? 'bg-[var(--brand-500)] text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  🏠 {page.is_home ? 'Es inicio' : 'Usar como inicio'}
                </button>
                <button
                  onClick={() => toggleNav(page)}
                  title="Mostrar u ocultar en el menú de navegación"
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${page.show_in_nav ? 'bg-[var(--brand-50)] text-[var(--brand-600)]' : 'bg-slate-100 text-slate-400'}`}
                >
                  {page.show_in_nav ? '☰ En menú' : '☰ Oculta del menú'}
                </button>
                <button
                  onClick={() => togglePublish(page)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${page.is_published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}
                >
                  {page.is_published ? 'Publicada' : 'Borrador'}
                </button>
                <Link href={`/admin/pages/${page.id}`} className="btn-secondary py-1.5 text-xs">
                  Editar
                </Link>
                <button onClick={() => deletePage(page)} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50">
                  Borrar
                </button>
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
