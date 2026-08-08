'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Block } from '@/lib/types';
import { COLOR_MAP } from '@/lib/colors';

export default function FormBlock({ block, userId }: { block: Block; userId?: string }) {
  const fields = block.config.fields || [];
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const supabase = createClient();
  const c = COLOR_MAP[block.config.color || 'brand'];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    const { error } = await supabase.from('form_submissions').insert({
      block_id: block.id,
      user_id: userId || null,
      data: values,
    });
    setStatus(error ? 'error' : 'saved');
  }

  if (status === 'saved') {
    return (
      <div className={`rounded-2xl border ${c.border} ${c.bg} p-6 text-center`}>
        <p className={`font-semibold ${c.text}`}>¡Gracias! Tu respuesta fue enviada.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {block.config.title && <h3 className="mb-4 text-lg font-bold">{block.config.title}</h3>}
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                rows={3}
                className="input-field"
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              />
            ) : (
              <input
                type={field.type}
                required={field.required}
                className="input-field"
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit" disabled={status === 'saving'} className="btn-primary mt-5 w-full">
        {status === 'saving' ? 'Enviando…' : block.config.submitText || 'Enviar'}
      </button>
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-600">Ocurrió un error, intenta de nuevo.</p>
      )}
    </form>
  );
}
