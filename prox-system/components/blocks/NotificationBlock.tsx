import type { BlockConfig } from '@/lib/types';
import { COLOR_MAP } from '@/lib/colors';

export default function NotificationBlock({ config }: { config: BlockConfig }) {
  const c = COLOR_MAP[config.color || 'yellow'];
  return (
    <div className={`flex items-start gap-3 rounded-xl border ${c.border} ${c.bg} p-4`}>
      <span className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${c.solid}`} />
      <div>
        {config.title && <p className={`text-sm font-semibold ${c.text}`}>{config.title}</p>}
        {config.body && <p className="text-sm text-slate-600">{config.body}</p>}
      </div>
    </div>
  );
}
