-- Rode este arquivo UMA vez no Supabase: SQL Editor > New query > colar > Run.

create table if not exists public.recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  storage_path text not null,
  mime_type text not null,
  duration_seconds integer not null default 0,
  size_bytes bigint not null default 0,
  song_id uuid, -- será ligado à tabela de músicas quando a biblioteca existir
  created_at timestamptz not null default now()
);
create index if not exists recordings_user_created_idx on public.recordings (user_id, created_at desc);

alter table public.recordings enable row level security;
drop policy if exists "recordings_own" on public.recordings;
create policy "recordings_own" on public.recordings
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Pasta privada de áudios: cada usuário só acessa a própria pasta (nome = id do usuário)
insert into storage.buckets (id, name, public) values ('recordings', 'recordings', false)
  on conflict (id) do nothing;

drop policy if exists "rec_files_select" on storage.objects;
drop policy if exists "rec_files_insert" on storage.objects;
drop policy if exists "rec_files_update" on storage.objects;
drop policy if exists "rec_files_delete" on storage.objects;
create policy "rec_files_select" on storage.objects for select to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "rec_files_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "rec_files_update" on storage.objects for update to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "rec_files_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'recordings' and (storage.foldername(name))[1] = auth.uid()::text);
