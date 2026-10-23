-- Alice Next Level — Supabase schema
-- Run this in a NEW Supabase project dedicated to Alice Next Level.
-- Never run it in ZPS/NOVEX or another project's database.

create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 100),
  description text not null default '' check (char_length(description) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  content text not null check (char_length(trim(content)) between 1 and 6000),
  tags text[] not null default '{}',
  source text not null default 'user-entered'
    check (source in ('user-entered', 'imported', 'ai-generated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint memories_tags_limit check (cardinality(tags) <= 30)
);

create index if not exists projects_owner_updated_idx
  on public.projects (owner_id, updated_at desc);
create index if not exists memories_owner_project_updated_idx
  on public.memories (owner_id, project_id, updated_at desc);
create index if not exists memories_tags_gin_idx
  on public.memories using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists memories_set_updated_at on public.memories;
create trigger memories_set_updated_at
before update on public.memories
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.memories enable row level security;

drop policy if exists "Owners manage their projects" on public.projects;
create policy "Owners manage their projects"
on public.projects
for all
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists "Owners manage memories in their projects" on public.memories;
create policy "Owners manage memories in their projects"
on public.memories
for all
to authenticated
using (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = (select auth.uid())
  )
)
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1 from public.projects p
    where p.id = project_id and p.owner_id = (select auth.uid())
  )
);

-- Intentionally no public/anon read or write policies.
-- Keep service_role keys on trusted server infrastructure only.
