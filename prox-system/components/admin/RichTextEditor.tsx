'use client';

import { useEffect, useRef } from 'react';

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    if (ref.current) onChange(ref.current.innerHTML);
  }

  function handleLink() {
    const url = window.prompt('Enlace (https://…)');
    if (url) exec('createLink', url);
  }

  const buttons: { label: string; cmd: string; arg?: string; title: string }[] = [
    { label: 'B', cmd: 'bold', title: 'Negrita' },
    { label: 'I', cmd: 'italic', title: 'Cursiva' },
    { label: 'U', cmd: 'underline', title: 'Subrayado' },
    { label: '•', cmd: 'insertUnorderedList', title: 'Lista' },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 shadow-sm">
      <div className="flex gap-1 border-b border-slate-200 bg-slate-50 p-1.5">
        {buttons.map((b) => (
          <button
            key={b.cmd}
            type="button"
            title={b.title}
            onClick={() => exec(b.cmd, b.arg)}
            className="h-7 w-7 rounded text-sm font-bold text-slate-600 hover:bg-slate-200"
          >
            {b.label}
          </button>
        ))}
        <button type="button" title="Enlace" onClick={handleLink} className="h-7 w-7 rounded text-sm text-slate-600 hover:bg-slate-200">
          🔗
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        className="min-h-[90px] px-3 py-2 text-sm outline-none empty:before:text-slate-400 empty:before:content-[attr(data-placeholder)]"
      />
    </div>
  );
}
