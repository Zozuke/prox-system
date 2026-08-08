import type { BlockConfig } from '@/lib/types';

export default function HeadingBlock({ config }: { config: BlockConfig }) {
  return (
    <div className="py-2">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{config.title}</h2>
      {config.subtitle && <p className="mt-1 text-slate-500">{config.subtitle}</p>}
    </div>
  );
}
