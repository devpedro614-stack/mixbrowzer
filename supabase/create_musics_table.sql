-- MixBrowzer Music Management - Database Schema
-- Execute this script in the Supabase SQL Editor to create the musics table with row-level security.

create extension if not exists pgcrypto;

create table if not exists public.musics (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  artist text not null,
  genre text not null,
  rating numeric(3,1) not null check (rating >= 0 and rating <= 10),
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.musics enable row level security;

grant select, insert, update, delete on public.musics to authenticated;

grant usage on schema public to authenticated;

-- Row Level Security Policies: Users can only access their own records
drop policy if exists "Users can select their own musics" on public.musics;
create policy "Users can select their own musics" on public.musics
  for select using (user_id = auth.uid()::text);

drop policy if exists "Users can insert their own musics" on public.musics;
create policy "Users can insert their own musics" on public.musics
  for insert with check (user_id = auth.uid()::text);

drop policy if exists "Users can update their own musics" on public.musics;
create policy "Users can update their own musics" on public.musics
  for update using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);

drop policy if exists "Users can delete their own musics" on public.musics;
create policy "Users can delete their own musics" on public.musics
  for delete using (user_id = auth.uid()::text);
