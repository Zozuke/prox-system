import { createClient } from '@/lib/supabase/server';
import type { Block, Page, Profile } from './types';

export async function getPageData(slug: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    profile = data as Profile | null;
  }

  // "home" es un valor especial: busca la página marcada como inicio (is_home),
  // sin importar cuál sea su slug real. Cualquier otro valor busca por slug normal.
  const query = supabase.from('pages').select('*').eq('is_published', true);
  const { data: page } =
    slug === 'home'
      ? await query.eq('is_home', true).maybeSingle()
      : await query.eq('slug', slug).maybeSingle();

  if (!page) return { page: null, blocks: [] as Block[], profile, userId: user?.id };

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', (page as Page).id)
    .eq('is_active', true)
    .order('order', { ascending: true });

  return { page: page as Page, blocks: (blocks || []) as Block[], profile, userId: user?.id };
}
