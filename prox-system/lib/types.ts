export type BlockType =
  | 'heading'
  | 'text'
  | 'card'
  | 'button'
  | 'image'
  | 'input'
  | 'form'
  | 'notification'
  | 'divider';

export type ColorTheme = 'slate' | 'brand' | 'red' | 'green' | 'yellow' | 'purple';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'textarea';
  required?: boolean;
}

export interface BlockConfig {
  title?: string;
  subtitle?: string;
  body?: string;
  bodyHtml?: string;
  color?: ColorTheme;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonAction?: 'link' | 'goto_page';
  inputLabel?: string;
  inputPlaceholder?: string;
  fields?: FormField[];
  submitText?: string;
}

export interface Block {
  id: string;
  page_id: string;
  type: BlockType;
  order: number;
  config: BlockConfig;
  visibility: 'all' | 'group' | 'user';
  target_group?: string | null;
  target_user_id?: string | null;
  is_active: boolean;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  is_home: boolean;
  is_published: boolean;
  show_in_nav: boolean;
  nav_order: number;
}

export interface SiteSettings {
  site_name: string;
  primary_color: string;
  font_family: string;
}

export interface PageVersion {
  id: string;
  page_id: string;
  blocks_snapshot: Array<Pick<Block, 'type' | 'order' | 'config' | 'visibility' | 'target_group' | 'target_user_id' | 'is_active'>>;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user';
  group: string;
}
