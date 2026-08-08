import type { BlockConfig } from '@/lib/types';
import { COLOR_MAP } from '@/lib/colors';
import Link from 'next/link';

export default function ButtonBlock({ config }: { config: BlockConfig }) {
  const c = COLOR_MAP[config.color || 'brand'];
  return (
    <Link
      href={config.buttonUrl || '#'}
      className={`inline-flex items-center rounded-xl ${c.solid} px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90`}
    >
      {config.buttonText || 'Ver más'}
    </Link>
  );
}
