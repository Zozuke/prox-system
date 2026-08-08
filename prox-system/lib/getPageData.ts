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

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (!page) return { page: null, blocks: [] as Block[], profile, userId: user?.id };

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', (page as Page).id)
    .eq('is_active', true)
    .order('order', { ascending: true });

  return { page: page as Page, blocks: (blocks || []) as Block[], profile, userId: user?.id };
}
