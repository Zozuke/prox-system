import type { BlockConfig } from '@/lib/types';

export default function ImageBlock({ config }: { config: BlockConfig }) {
  if (!config.imageUrl) return null;
  return (
    <figure>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.imageUrl}
        alt={config.title || ''}
        className="w-full rounded-2xl border border-slate-200 object-cover"
      />
      {config.title && <figcaption className="mt-2 text-sm text-slate-500">{config.title}</figcaption>}
    </figure>
  );
}
