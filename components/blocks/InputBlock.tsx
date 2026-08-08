'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Block } from '@/lib/types';

export default function InputBlock({ block, userId }: { block: Block; userId?: string }) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const supabase = createClient();

  async function save() {
    if (!value.trim()) return;
    setStatus('saving');
    await supabase.from('form_submissions').insert({
      block_id: block.id,
      user_id: userId || null,
      data: { value },
    });
    setStatus('saved');
  }

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <label className="text-sm font-medium text-slate-700 sm:w-48">
        {block.config.inputLabel || 'Tu respuesta'}
      </label>
      <div className="flex flex-1 gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder={block.config.inputPlaceholder || 'Escribe aquí...'}
          className="input-field flex-1"
        />
        <button onClick={save} className="btn-primary whitespace-nowrap">
          {status === 'saving' ? 'Guardando…' : status === 'saved' ? '✓ Guardado' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
