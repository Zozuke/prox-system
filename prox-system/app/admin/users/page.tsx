'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers((data || []) as Profile[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateGroup(userId: string, group: string) {
    await supabase.from('profiles').update({ group }).eq('id', userId);
    load();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Usuarios</h1>
      <p className="mb-6 text-sm text-slate-500">
        Asigna un grupo a cada usuario para poder mostrarle bloques específicos por grupo.
      </p>
      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="card-surface flex items-center justify-between">
            <div>
              <p className="font-semibold">{u.full_name || '(sin nombre)'}</p>
              <p className="text-xs text-slate-400">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {u.role === 'admin' && (
                <span className="rounded-full bg-[var(--brand-50)] px-2 py-1 text-xs font-bold text-[var(--brand-600)]">Administrador</span>
              )}
              <input
                defaultValue={u.group}
                onBlur={(e) => updateGroup(u.id, e.target.value)}
                placeholder="grupo"
                className="input-field w-32 py-1.5 text-xs"
              />
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-slate-400">Aún no hay usuarios registrados.</p>}
      </div>
    </div>
  );
}
