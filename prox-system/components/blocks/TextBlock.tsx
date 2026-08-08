import type { BlockConfig } from '@/lib/types';
import DOMPurify from 'isomorphic-dompurify';

export default function TextBlock({ config }: { config: BlockConfig }) {
  if (config.bodyHtml) {
    const clean = DOMPurify.sanitize(config.bodyHtml, { ALLOWED_TAGS: ['b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'a', 'br', 'p'], ALLOWED_ATTR: ['href', 'target', 'rel'] });
    return <div className="prose-sm leading-relaxed text-slate-700 [&_a]:text-[var(--brand-600)] [&_a]:underline" dangerouslySetInnerHTML={{ __html: clean }} />;
  }
  return <p className="whitespace-pre-line leading-relaxed text-slate-700">{config.body}</p>;
}
