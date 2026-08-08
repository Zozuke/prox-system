'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Block, Page } from '@/lib/types';
import { BLOCK_LIBRARY } from '@/lib/blockLibrary';
import BlockConfigForm from '@/components/admin/BlockConfigForm';
import BlockRenderer from '@/components/BlockRenderer';
import DragList from '@/components/admin/DragList';
import HistoryPanel from '@/components/admin/HistoryPanel';
import Link from 'next/link';

export default function PageBuilder({ params }: { params: { id: string } }) {
  const [page, setPage] = useState<Page | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  async function load() {
    const { data: pageData } = await supabase.from('pages').select('*').eq('id', params.id).maybeSingle();
    setPage(pageData as Page);
    const { data: blockData } = await supabase
      .from('blocks')
      .select('*')
      .eq('page_id', params.id)
      .order('order', { ascending: true });
    setBlocks((blockData || []) as Block[]);
    const { data: userData } = await supabase.from('profiles').select('id, full_name, email').order('full_name');
    setUsers(userData || []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Guarda una "foto" del estado actual de bloques para poder deshacer más tarde
  async function snapshot(currentBlocks: Block[]) {
    const payload = currentBlocks.map((b) => ({
      type: b.type,
      order: b.order,
      config: b.config,
      visibility: b.visibility,
      target_group: b.target_group,
      target_user_id: b.target_user_id,
      is_active: b.is_active,
    }));
    await supabase.from('page_versions').insert({ page_id: params.id, blocks_snapshot: payload });
  }

  async function addBlock(type: (typeof BLOCK_LIBRARY)[number]) {
    setShowLibrary(false);
    const { data, error } = await supabase
      .from('blocks')
      .insert({ page_id: params.id, type: type.type, order: blocks.length, config: type.defaultConfig, visibility: 'all' })
      .select()
      .single();
    if (!error && data) {
      const updated = [...blocks, data as Block];
      setBlocks(updated);
      setOpenBlockId(data.id);
      snapshot(updated);
    }
  }

  async function saveBlock(block: Block) {
    setSaving(block.id);
    await supabase
      .from('blocks')
      .update({ config: block.config, visibility: block.visibility, target_group: block.target_group, target_user_id: block.target_user_id })
      .eq('id', block.id);
    const updated = blocks.map((b) => (b.id === block.id ? block : b));
    setBlocks(updated);
    setSaving(null);
    snapshot(updated);
  }

  async function deleteBlock(id: string) {
    if (!confirm('¿Borrar este bloque?')) return;
    await supabase.from('blocks').delete().eq('id', id);
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    snapshot(updated);
  }

  async function toggleActive(block: Block) {
    const updated = { ...block, is_active: !block.is_active };
    await supabase.from('blocks').update({ is_active: updated.is_active }).eq('id', block.id);
    const newBlocks = blocks.map((b) => (b.id === block.id ? updated : b));
    setBlocks(newBlocks);
    snapshot(newBlocks);
  }

  async function handleReorder(newOrder: Block[]) {
    setBlocks(newOrder);
    await Promise.all(newOrder.map((b, i) => supabase.from('blocks').update({ order: i }).eq('id', b.id)));
    snapshot(newOrder);
  }

  if (!page) return <p className="text-sm text-slate-400">Cargando…</p>;

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8">
      {/* Columna izquierda: editor */}
      <div>
        <div className="flex items-center justify-between">
          <Link href="/admin" className="text-xs font-semibold text-slate-400 hover:text-slate-600">← Volver a páginas</Link>
          <button onClick={() => setShowHistory(true)} className="text-xs font-semibold text-slate-500 hover:text-slate-800">
            🕓 Historial / Deshacer
          </button>
        </div>
        <h1 className="mt-1 text-2xl font-bold">{page.title}</h1>
        <p className="mb-6 text-sm text-slate-400">/{page.slug} · arrastra ⠿⠿ para reordenar · los cambios se ven en vivo</p>

        {blocks.length === 0 ? (
          <p className="text-sm text-slate-400">Agrega tu primer bloque abajo.</p>
        ) : (
          <DragList
            items={blocks}
            getId={(b) => b.id}
            onReorder={handleReorder}
            renderItem={(block, drag) => {
              const meta = BLOCK_LIBRARY.find((l) => l.type === block.type)!;
              const open = openBlockId === block.id;
              return (
                <div className={`card-surface ${!block.is_active ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span {...drag} className="cursor-grab select-none text-slate-300 active:cursor-grabbing">⠿⠿</span>
                      <button onClick={() => setOpenBlockId(open ? null : block.id)} className="flex items-center gap-2 text-left">
                        <span>{meta.icon}</span>
                        <span className="text-sm font-semibold">{meta.label}</span>
                        {block.visibility !== 'all' && (
                          <span className="rounded-full bg-[var(--brand-50)] px-2 py-0.5 text-[10px] font-bold text-[var(--brand-600)]">
                            {block.visibility === 'user' ? 'usuario específico' : 'grupo'}
                          </span>
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleActive(block)} className="rounded px-1.5 py-1 text-xs text-slate-400 hover:bg-slate-100">
                        {block.is_active ? '👁️' : '🚫'}
                      </button>
                      <button onClick={() => deleteBlock(block.id)} className="rounded px-1.5 py-1 text-xs text-red-400 hover:bg-red-50">🗑️</button>
                    </div>
                  </div>

                  {open && (
                    <>
                      <BlockConfigForm block={block} users={users} onChange={(b) => setBlocks((bs) => bs.map((x) => (x.id === b.id ? b : x)))} />
                      <button onClick={() => saveBlock(blocks.find((b) => b.id === block.id)!)} className="btn-primary mt-4 w-full">
                        {saving === block.id ? 'Guardando…' : 'Guardar cambios'}
                      </button>
                    </>
                  )}
                </div>
              );
            }}
          />
        )}

        <div className="relative mt-4">
          <button onClick={() => setShowLibrary((s) => !s)} className="btn-secondary w-full">+ Agregar bloque</button>
          {showLibrary && (
            <div className="absolute z-10 mt-2 grid w-full grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
              {BLOCK_LIBRARY.map((item) => (
                <button key={item.type} onClick={() => addBlock(item)} className="flex items-center gap-2 rounded-lg p-2 text-left text-sm hover:bg-slate-50">
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Columna derecha: vista previa en vivo */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Vista previa en vivo</p>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            {blocks.filter((b) => b.is_active).map((b) => (
              <BlockRenderer key={b.id} block={b} />
            ))}
            {blocks.length === 0 && <p className="text-sm text-slate-400">Agrega un bloque para verlo aquí.</p>}
          </div>
        </div>
      </div>

      {showHistory && (
        <HistoryPanel pageId={params.id} onClose={() => setShowHistory(false)} onRestore={load} />
      )}
    </div>
  );
}
