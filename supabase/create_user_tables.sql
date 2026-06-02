-- MixBrowzer Music Management - User Profile Schema
-- Execute este script no editor SQL do Supabase para criar a tabela de perfis de usuário.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant usage on schema public to authenticated;

-- Row Level Security Policies: cada usuário só vê e altera seu próprio perfil

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Users can delete their own profile" on public.profiles;
create policy "Users can delete their own profile" on public.profiles
  for delete using (id = auth.uid());

-- Atualiza o timestamp updated_at automaticamente no momento da modificação
create or replace function public.update_profile_timestamp()
returns trigger stable language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profile_updated_at
  before update on public.profiles
  for each row execute procedure public.update_profile_timestamp();
