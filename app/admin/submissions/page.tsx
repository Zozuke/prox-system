'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Submission {
  id: string;
  data: Record<string, string>;
  created_at: string;
  blocks: { type: string; config: { title?: string; inputLabel?: string } } | null;
  profiles: { full_name: string; email: string } | null;
}

export default function AdminSubmissions() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('form_submissions')
        .select('id, data, created_at, blocks(type, config), profiles(full_name, email)')
        .order('created_at', { ascending: false });
      setRows((data || []) as unknown as Submission[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Respuestas recibidas</h1>
      <p className="mb-6 text-sm text-slate-500">Lo que los usuarios enviaron en formularios y entradas de texto.</p>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-slate-400">Aún no hay respuestas.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="card-surface">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">
                  {r.blocks?.config?.title || r.blocks?.config?.inputLabel || r.blocks?.type}
                </p>
                <span className="text-xs text-slate-400">{new Date(r.created_at).toLocaleString('es')}</span>
              </div>
              <p className="mb-2 text-xs text-slate-400">
                {r.profiles ? `${r.profiles.full_name} · ${r.profiles.email}` : 'Usuario anónimo'}
              </p>
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                {Object.entries(r.data).map(([k, v]) => (
                  <p key={k}><span className="font-medium">{k}:</span> {v}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
