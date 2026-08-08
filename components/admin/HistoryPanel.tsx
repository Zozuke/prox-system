'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { PageVersion } from '@/lib/types';

export default function HistoryPanel({ pageId, onRestore, onClose }: { pageId: string; onRestore: () => void; onClose: () => void }) {
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('page_versions')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false })
        .limit(25);
      setVersions((data || []) as PageVersion[]);
      setLoading(false);
    })();
  }, [pageId]);

  async function restore(version: PageVersion) {
    if (!confirm('Esto reemplazará el contenido actual de la página con esta versión anterior. ¿Continuar?')) return;
    setRestoring(version.id);
    await supabase.from('blocks').delete().eq('page_id', pageId);
    if (version.blocks_snapshot.length > 0) {
      await supabase.from('blocks').insert(version.blocks_snapshot.map((b) => ({ ...b, page_id: pageId })));
    }
    setRestoring(null);
    onRestore();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-6" onClick={onClose}>
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Historial de cambios</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Cargando…</p>
        ) : versions.length === 0 ? (
          <p className="text-sm text-slate-400">Aún no hay versiones guardadas de esta página.</p>
        ) : (
          <div className="space-y-2">
            {versions.map((v, i) => (
              <div key={v.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="text-sm font-medium">{i === 0 ? 'Versión más reciente' : `Hace ${i} cambio${i > 1 ? 's' : ''}`}</p>
                  <p className="text-xs text-slate-400">{new Date(v.created_at).toLocaleString('es')}</p>
                  <p className="text-xs text-slate-400">{v.blocks_snapshot.length} bloque(s)</p>
                </div>
                <button onClick={() => restore(v)} disabled={restoring === v.id} className="btn-secondary py-1.5 text-xs">
                  {restoring === v.id ? 'Restaurando…' : 'Restaurar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
