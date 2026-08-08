'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Block } from '@/lib/types';

/**
 * Se suscribe a la tabla "blocks" de una página en Supabase Realtime.
 * Cualquier cambio hecho desde el panel admin (crear, editar, borrar,
 * reordenar) se refleja aquí al instante, sin recargar la página.
 */
export function useRealtimeBlocks(pageId: string | null, initialBlocks: Block[]) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const supabase = createClient();

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    if (!pageId) return;

    const channel = supabase
      .channel(`blocks-page-${pageId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blocks', filter: `page_id=eq.${pageId}` },
        async () => {
          // Volvemos a pedir la lista completa para respetar RLS y visibilidad
          const { data } = await supabase
            .from('blocks')
            .select('*')
            .eq('page_id', pageId)
            .eq('is_active', true)
            .order('order', { ascending: true });
          if (data) setBlocks(data as Block[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  return blocks;
}
