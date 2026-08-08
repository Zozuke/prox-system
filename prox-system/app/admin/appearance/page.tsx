'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AVAILABLE_FONTS } from '@/lib/fonts';
import type { SiteSettings } from '@/lib/types';

const PRESET_COLORS = ['#4b6fff', '#ef4444', '#22c55e', '#eab308', '#a855f7', '#0ea5e9', '#f97316', '#14b8a6', '#111827'];

export default function AppearancePage() {
  const [settings, setSettings] = useState<SiteSettings>({ site_name: 'Prox System', primary_color: '#4b6fff', font_family: 'Inter' });
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
      if (data) setSettings({ site_name: data.site_name, primary_color: data.primary_color, font_family: data.font_family });
      setLoaded(true);
    })();
  }, []);

  async function save() {
    setSaving(true);
    await supabase.from('site_settings').upsert({ id: true, ...settings });
    setSaving(false);
    // Refrescamos para que el color/fuente nuevos se vean de inmediato en todo el sitio
    window.location.reload();
  }

  if (!loaded) return <p className="text-sm text-slate-400">Cargando…</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Apariencia</h1>
      <p className="mb-6 text-sm text-slate-500">Cambia el color y la tipografía de todo el sitio. Se aplica al instante para todos.</p>

      <div className="card-surface space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nombre del sitio</label>
          <input
            className="input-field"
            value={settings.site_name}
            onChange={(e) => setSettings((s) => ({ ...s, site_name: e.target.value }))}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Color principal</label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setSettings((s) => ({ ...s, primary_color: c }))}
                className={`h-8 w-8 rounded-full border-2 ${settings.primary_color === c ? 'border-slate-800' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={settings.primary_color}
              onChange={(e) => setSettings((s) => ({ ...s, primary_color: e.target.value }))}
              className="h-8 w-10 cursor-pointer rounded border border-slate-300"
              title="Elegir color personalizado"
            />
            <span className="text-xs text-slate-400">{settings.primary_color}</span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Tipografía</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_FONTS.map((f) => (
              <button
                key={f.name}
                onClick={() => setSettings((s) => ({ ...s, font_family: f.name }))}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${
                  settings.font_family === f.name ? 'border-[var(--brand-500)] bg-[var(--brand-50)]' : 'border-slate-200'
                }`}
                style={{ fontFamily: f.stack }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary w-full">
          {saving ? 'Guardando…' : 'Guardar y aplicar a todo el sitio'}
        </button>
      </div>
    </div>
  );
}
