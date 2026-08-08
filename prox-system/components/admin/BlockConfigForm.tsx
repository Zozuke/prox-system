'use client';

import type { Block, FormField } from '@/lib/types';
import { COLOR_OPTIONS } from '@/lib/colors';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';

interface Props {
  block: Block;
  users: { id: string; full_name: string; email: string }[];
  onChange: (block: Block) => void;
}

export default function BlockConfigForm({ block, users, onChange }: Props) {
  function setConfig(patch: Partial<Block['config']>) {
    onChange({ ...block, config: { ...block.config, ...patch } });
  }

  function setField(index: number, patch: Partial<FormField>) {
    const fields = [...(block.config.fields || [])];
    fields[index] = { ...fields[index], ...patch };
    setConfig({ fields });
  }

  function addField() {
    const fields = [...(block.config.fields || []), { name: `campo${(block.config.fields?.length || 0) + 1}`, label: 'Nuevo campo', type: 'text' as const, required: false }];
    setConfig({ fields });
  }

  function removeField(index: number) {
    const fields = (block.config.fields || []).filter((_, i) => i !== index);
    setConfig({ fields });
  }

  const needsColor = ['card', 'button', 'notification'].includes(block.type);
  const needsTitle = ['heading', 'card', 'image', 'notification', 'form'].includes(block.type);
  const needsSubtitle = block.type === 'heading';
  const needsBody = ['text', 'card', 'notification'].includes(block.type);
  const needsButton = ['card', 'button'].includes(block.type);
  const needsImage = block.type === 'image';
  const needsInputLabel = block.type === 'input';
  const needsFormFields = block.type === 'form';

  return (
    <div className="space-y-4 border-t border-slate-100 pt-4">
      {needsTitle && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Título</label>
          <input className="input-field" value={block.config.title || ''} onChange={(e) => setConfig({ title: e.target.value })} />
        </div>
      )}
      {needsSubtitle && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Subtítulo</label>
          <input className="input-field" value={block.config.subtitle || ''} onChange={(e) => setConfig({ subtitle: e.target.value })} />
        </div>
      )}
      {needsBody && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Texto</label>
          <RichTextEditor
            value={block.config.bodyHtml || block.config.body || ''}
            onChange={(html) => setConfig({ bodyHtml: html, body: html.replace(/<[^>]+>/g, '') })}
            placeholder="Escribe aquí tu texto…"
          />
        </div>
      )}
      {needsImage && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Imagen</label>
          <ImageUploader value={block.config.imageUrl} onChange={(url) => setConfig({ imageUrl: url })} />
        </div>
      )}
      {needsButton && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Texto del botón</label>
            <input className="input-field" value={block.config.buttonText || ''} onChange={(e) => setConfig({ buttonText: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Enlace (URL o /pagina)</label>
            <input className="input-field" value={block.config.buttonUrl || ''} onChange={(e) => setConfig({ buttonUrl: e.target.value })} placeholder="/promos" />
          </div>
        </div>
      )}
      {needsInputLabel && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Etiqueta</label>
            <input className="input-field" value={block.config.inputLabel || ''} onChange={(e) => setConfig({ inputLabel: e.target.value })} placeholder="Tu nombre" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500">Texto de ejemplo</label>
            <input className="input-field" value={block.config.inputPlaceholder || ''} onChange={(e) => setConfig({ inputPlaceholder: e.target.value })} />
          </div>
        </div>
      )}
      {needsFormFields && (
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">Campos del formulario</label>
          <div className="space-y-2">
            {(block.config.fields || []).map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2">
                <input
                  className="input-field flex-1"
                  value={f.label}
                  onChange={(e) => setField(i, { label: e.target.value })}
                  placeholder="Etiqueta"
                />
                <select className="input-field w-32" value={f.type} onChange={(e) => setField(i, { type: e.target.value as FormField['type'] })}>
                  <option value="text">Texto</option>
                  <option value="email">Correo</option>
                  <option value="number">Número</option>
                  <option value="textarea">Párrafo</option>
                </select>
                <label className="flex items-center gap-1 text-xs text-slate-500">
                  <input type="checkbox" checked={!!f.required} onChange={(e) => setField(i, { required: e.target.checked })} />
                  Requerido
                </label>
                <button onClick={() => removeField(i)} className="text-xs font-semibold text-red-500">✕</button>
              </div>
            ))}
          </div>
          <button onClick={addField} className="btn-secondary mt-2 py-1.5 text-xs">+ Agregar campo</button>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-slate-500">Texto del botón de envío</label>
            <input className="input-field" value={block.config.submitText || ''} onChange={(e) => setConfig({ submitText: e.target.value })} />
          </div>
        </div>
      )}
      {needsColor && (
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Color</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setConfig({ color: c })}
                className={`h-7 w-7 rounded-full border-2 ${block.config.color === c ? 'border-slate-800' : 'border-transparent'}`}
                style={{ backgroundColor: { slate: '#64748b', brand: 'var(--brand-500)', red: '#ef4444', green: '#22c55e', yellow: '#eab308', purple: '#a855f7' }[c] }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">
        <label className="mb-1 block text-xs font-semibold text-slate-500">¿Quién puede ver este bloque?</label>
        <select
          className="input-field"
          value={block.visibility}
          onChange={(e) => onChange({ ...block, visibility: e.target.value as Block['visibility'], target_user_id: null, target_group: null })}
        >
          <option value="all">Todos los usuarios</option>
          <option value="group">Un grupo específico</option>
          <option value="user">Un usuario específico</option>
        </select>

        {block.visibility === 'group' && (
          <input
            className="input-field mt-2"
            placeholder="Nombre del grupo (ej: vip, empleados)"
            value={block.target_group || ''}
            onChange={(e) => onChange({ ...block, target_group: e.target.value })}
          />
        )}

        {block.visibility === 'user' && (
          <select
            className="input-field mt-2"
            value={block.target_user_id || ''}
            onChange={(e) => onChange({ ...block, target_user_id: e.target.value })}
          >
            <option value="">Selecciona un usuario…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
