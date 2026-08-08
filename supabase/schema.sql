-- =========================================================
-- PROX-SYSTEM · Esquema de base de datos para Supabase
-- Copia y pega TODO este archivo en:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =========================================================

-- Extensión necesaria para generar UUIDs
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1. PERFILES DE USUARIO (extiende auth.users de Supabase)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'user' check (role in ('admin','user')),
  "group" text default 'general',
  created_at timestamptz not null default now()
);

-- Cuando alguien se registra en auth.users, se crea automáticamente su perfil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    case when new.email = 'ortunoivan2000@gmail.com' then 'admin' else 'user' end
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- 2. PÁGINAS (creadas dinámicamente desde el panel admin)
-- ---------------------------------------------------------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,          -- ej: "home", "bienvenida", "promos"
  title text not null,
  is_home boolean not null default false,
  is_published boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 3. BLOQUES (las tarjetas, botones, textos, formularios, etc.)
-- ---------------------------------------------------------
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null check (type in (
    'heading','text','card','button','image',
    'input','form','notification','divider'
  )),
  "order" integer not null default 0,
  -- Contenido y estilo del bloque, flexible en JSON:
  -- ej: { "title": "...", "body": "...", "color": "red", "buttonText": "...", "buttonUrl": "...",
  --       "fields": [{ "label": "Tu nombre", "name": "nombre", "type": "text" }] }
  config jsonb not null default '{}'::jsonb,
  -- Visibilidad: 'all' (todos), 'group' (un grupo), 'user' (un usuario específico)
  visibility text not null default 'all' check (visibility in ('all','group','user')),
  target_group text,
  target_user_id uuid references public.profiles(id),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blocks_page on public.blocks(page_id);
create index if not exists idx_blocks_target_user on public.blocks(target_user_id);

-- ---------------------------------------------------------
-- 4. RESPUESTAS DE FORMULARIOS (lo que los usuarios envían)
-- ---------------------------------------------------------
create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references public.blocks(id) on delete cascade,
  user_id uuid references public.profiles(id),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 5. Trigger genérico para actualizar updated_at
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists pages_updated_at on public.pages;
create trigger pages_updated_at before update on public.pages
  for each row execute procedure public.set_updated_at();

drop trigger if exists blocks_updated_at on public.blocks;
create trigger blocks_updated_at before update on public.blocks
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------
-- 6. ROW LEVEL SECURITY (seguridad por fila)
-- ---------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.pages enable row level security;
alter table public.blocks enable row level security;
alter table public.form_submissions enable row level security;

-- Perfiles: cada quien ve y edita el suyo; el admin ve todos
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (
    auth.uid() = id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Páginas: visibles para todos los autenticados si están publicadas; admin ve/edita todo
create policy "pages_select_published" on public.pages
  for select using (
    is_published = true
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "pages_admin_all" on public.pages
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Bloques: el usuario ve bloques 'all', de su grupo, o dirigidos a él; el admin ve/edita todo
create policy "blocks_select_visible" on public.blocks
  for select using (
    is_active = true and (
      visibility = 'all'
      or (visibility = 'user' and target_user_id = auth.uid())
      or (visibility = 'group' and target_group = (
            select "group" from public.profiles where id = auth.uid()
          ))
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
    )
  );

create policy "blocks_admin_all" on public.blocks
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Formularios: el usuario crea e inserta las suyas, el admin ve todas
create policy "submissions_insert_own" on public.form_submissions
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "submissions_select_own_or_admin" on public.form_submissions
  for select using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------
-- 7. Habilitar Realtime en las tablas clave
-- ---------------------------------------------------------
alter publication supabase_realtime add table public.blocks;
alter publication supabase_realtime add table public.pages;

-- ---------------------------------------------------------
-- 9. NUEVO: columnas para el menú de navegación de páginas
-- ---------------------------------------------------------
alter table public.pages add column if not exists show_in_nav boolean not null default true;
alter table public.pages add column if not exists nav_order integer not null default 0;

-- ---------------------------------------------------------
-- 10. NUEVO: configuración global del sitio (apariencia)
-- ---------------------------------------------------------
create table if not exists public.site_settings (
  id boolean primary key default true,
  site_name text not null default 'Prox System',
  primary_color text not null default '#4b6fff',
  font_family text not null default 'Inter',
  constraint single_row check (id)
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

alter table public.site_settings enable row level security;

create policy "site_settings_select_public" on public.site_settings
  for select using (true);

create policy "site_settings_admin_write" on public.site_settings
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------
-- 11. NUEVO: historial de versiones de cada página (deshacer)
-- ---------------------------------------------------------
create table if not exists public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages(id) on delete cascade,
  blocks_snapshot jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_page_versions_page on public.page_versions(page_id, created_at desc);

alter table public.page_versions enable row level security;

create policy "page_versions_admin_all" on public.page_versions
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------
-- 12. NUEVO: bucket de almacenamiento para imágenes subidas
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

create policy "images_public_read" on storage.objects
  for select using (bucket_id = 'images');

create policy "images_admin_upload" on storage.objects
  for insert with check (
    bucket_id = 'images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "images_admin_delete" on storage.objects
  for delete using (
    bucket_id = 'images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------
-- 13. Página inicial de ejemplo (opcional, se puede borrar desde el panel)
-- ---------------------------------------------------------
insert into public.pages (slug, title, is_home, is_published, show_in_nav, nav_order)
values ('home', 'Inicio', true, true, true, 0)
on conflict (slug) do nothing;

