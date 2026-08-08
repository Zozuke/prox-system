import type { BlockConfig } from '@/lib/types';
import { COLOR_MAP } from '@/lib/colors';
import DOMPurify from 'isomorphic-dompurify';
import Link from 'next/link';

export default function CardBlock({ config }: { config: BlockConfig }) {
  const c = COLOR_MAP[config.color || 'slate'];
  const cleanBody = config.bodyHtml
    ? DOMPurify.sanitize(config.bodyHtml, { ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'a', 'br', 'p'], ALLOWED_ATTR: ['href', 'target', 'rel'] })
    : null;

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-5 shadow-sm`}>
      {config.title && <h3 className={`text-lg font-bold ${c.text}`}>{config.title}</h3>}
      {cleanBody ? (
        <div className="mt-1.5 text-sm text-slate-600 [&_a]:text-[var(--brand-600)] [&_a]:underline" dangerouslySetInnerHTML={{ __html: cleanBody }} />
      ) : (
        config.body && <p className="mt-1.5 text-sm text-slate-600">{config.body}</p>
      )}
      {config.buttonText && (
        <Link
          href={config.buttonUrl || '#'}
          className={`mt-4 inline-flex items-center rounded-lg ${c.solid} px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90`}
        >
          {config.buttonText}
        </Link>
      )}
    </div>
  );
}
