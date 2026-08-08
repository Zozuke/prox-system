'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ImageUploader({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(path, file, { upsert: false });
    if (uploadError) {
      setError('No se pudo subir la imagen: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mb-2 h-32 w-full rounded-lg border border-slate-200 object-cover" />
      )}
      <div className="flex gap-2">
        <label className="btn-secondary cursor-pointer py-1.5 text-xs">
          {uploading ? 'Subiendo…' : '📤 Subir imagen'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
        <input
          className="input-field flex-1 text-xs"
          placeholder="…o pega una URL"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
