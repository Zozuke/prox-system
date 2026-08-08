import { createClient } from './supabase/server';
import type { SiteSettings } from './types';

const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Prox System',
  primary_color: '#4b6fff',
  font_family: 'Inter',
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', true).maybeSingle();
  if (!data) return DEFAULT_SETTINGS;
  return {
    site_name: data.site_name || DEFAULT_SETTINGS.site_name,
    primary_color: data.primary_color || DEFAULT_SETTINGS.primary_color,
    font_family: data.font_family || DEFAULT_SETTINGS.font_family,
  };
}
