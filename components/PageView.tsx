'use client';

import { useRealtimeBlocks } from '@/hooks/useRealtimeBlocks';
import BlockRenderer from './BlockRenderer';
import type { Block, Page } from '@/lib/types';
import Navbar from './Navbar';

export default function PageView({
  page,
  initialBlocks,
  userId,
  userName,
}: {
  page: Page;
  initialBlocks: Block[];
  userId?: string;
  userName?: string;
}) {
  const blocks = useRealtimeBlocks(page.id, initialBlocks);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={userName} />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="space-y-5">
          {blocks.length === 0 && (
            <p className="text-center text-sm text-slate-400">
              Esta página aún no tiene contenido. El administrador puede agregarlo desde el panel.
            </p>
          )}
          {blocks.map((block: Block) => (
            <BlockRenderer key={block.id} block={block} userId={userId} />
          ))}
        </div>
      </main>
    </div>
  );
}
