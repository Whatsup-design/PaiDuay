-- Run this once in the Supabase SQL Editor.
-- Quest stores province and village/market missions for the MVP display flow.

create extension if not exists pgcrypto;

do $$
begin
  create type public.quest_type as enum ('province', 'village_market');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.quest_difficulty as enum ('easy', 'medium', 'hard');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.quest_items (
  quest_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  quest_type public.quest_type not null,
  difficulty public.quest_difficulty not null,
  place_name text,
  province text not null default 'Phuket',
  district text,
  avg_duration text not null default '',
  reward text not null default '',
  steps jsonb not null default '[]'::jsonb,
  image_url text not null default '',
  image_path text not null default '',
  image_alt text,
  google_maps_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quest_items_slug_idx on public.quest_items(slug);
create index if not exists quest_items_quest_type_idx on public.quest_items(quest_type);
create index if not exists quest_items_difficulty_idx on public.quest_items(difficulty);
create index if not exists quest_items_district_idx on public.quest_items(district);
create index if not exists quest_items_featured_idx on public.quest_items(is_featured);
create index if not exists quest_items_active_idx on public.quest_items(is_active);

create or replace function public.quest_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quest_items_set_updated_at on public.quest_items;
create trigger quest_items_set_updated_at
before update on public.quest_items
for each row
execute function public.quest_set_updated_at();

alter table public.quest_items enable row level security;

grant select on public.quest_items to anon, authenticated;

drop policy if exists "Public can read active quest items" on public.quest_items;
create policy "Public can read active quest items"
on public.quest_items
for select
using (is_active = true);

insert into public.quest_items (
  slug,
  name,
  description,
  quest_type,
  difficulty,
  place_name,
  province,
  district,
  avg_duration,
  reward,
  steps,
  image_url,
  image_path,
  image_alt,
  google_maps_url,
  is_featured
) values
  (
    'phuket-otop-passport',
    'Phuket OTOP Passport',
    'A long-form provincial route that connects villages, markets, and local shops across Phuket.',
    'province',
    'hard',
    'Phuket province',
    'Phuket',
    null,
    '1-2 days',
    'Passport badge + premium local reward',
    '[
      {"order":1,"title":"Visit Ban Bang Rong community","description":"","place_name":"Ban Bang Rong","checkpoint_type":"visit"},
      {"order":2,"title":"Check in at Old Phuket Town market","description":"","place_name":"Old Phuket Town","checkpoint_type":"check_in"},
      {"order":3,"title":"Discover one local OTOP shop","description":"","place_name":"","checkpoint_type":"discover"},
      {"order":4,"title":"Complete final QR scan to claim the passport badge","description":"","place_name":"","checkpoint_type":"qr_scan"}
    ]'::jsonb,
    '',
    '',
    'Phuket OTOP Passport quest',
    '',
    true
  ),
  (
    'coastal-community-route',
    'Coastal Community Route',
    'A province-level journey focused on responsible tourism and coastal community services.',
    'province',
    'medium',
    'Rawai, Chalong, Thalang',
    'Phuket',
    null,
    'Full day',
    'Marine friendly traveler badge',
    '[
      {"order":1,"title":"Start at Rawai Sea Village","description":"","place_name":"Rawai Sea Village","checkpoint_type":"visit"},
      {"order":2,"title":"Learn one marine-friendly activity","description":"","place_name":"","checkpoint_type":"learn"},
      {"order":3,"title":"Visit Chalong wellness partner","description":"","place_name":"Chalong","checkpoint_type":"visit"},
      {"order":4,"title":"End with a local product discovery","description":"","place_name":"","checkpoint_type":"discover"}
    ]'::jsonb,
    '',
    '',
    'Coastal Community Route quest',
    '',
    true
  ),
  (
    'bang-rong-mangrove-mini',
    'Bang Rong Mangrove Mini Quest',
    'A compact village quest where visitors scan QR points, learn local stories, and support community services.',
    'village_market',
    'easy',
    'Ban Bang Rong',
    'Phuket',
    'Thalang',
    '45-60 min',
    'Local explorer points',
    '[
      {"order":1,"title":"Check in at the community welcome point","description":"","place_name":"Ban Bang Rong","checkpoint_type":"check_in"},
      {"order":2,"title":"Scan the mangrove story QR","description":"","place_name":"","checkpoint_type":"qr_scan"},
      {"order":3,"title":"Visit one local food or service booth","description":"","place_name":"","checkpoint_type":"visit"}
    ]'::jsonb,
    '',
    '',
    'Bang Rong Mangrove Mini Quest',
    '',
    false
  ),
  (
    'old-town-market-scan',
    'Old Town Market Scan',
    'A short market quest for discovering local snacks, crafts, and community sellers in one walkable area.',
    'village_market',
    'easy',
    'Old Phuket Town',
    'Phuket',
    'Mueang Phuket',
    '30-45 min',
    'Market discovery coupon',
    '[
      {"order":1,"title":"Find the first market QR","description":"","place_name":"Old Phuket Town","checkpoint_type":"qr_scan"},
      {"order":2,"title":"Discover two local sellers","description":"","place_name":"","checkpoint_type":"discover"},
      {"order":3,"title":"Complete a mini review to unlock the coupon","description":"","place_name":"","checkpoint_type":"review"}
    ]'::jsonb,
    '',
    '',
    'Old Town Market Scan quest',
    '',
    false
  ),
  (
    'chalong-wellness-trail',
    'Chalong Wellness Trail',
    'A focused quest for visitors who want to learn about herbs, massage knowledge, and local wellness products.',
    'village_market',
    'medium',
    'Chalong',
    'Phuket',
    'Mueang Phuket',
    '60 min',
    'Wellness partner stamp',
    '[
      {"order":1,"title":"Check in at wellness partner","description":"","place_name":"Chalong","checkpoint_type":"check_in"},
      {"order":2,"title":"Scan one herbal knowledge card","description":"","place_name":"","checkpoint_type":"qr_scan"},
      {"order":3,"title":"Try or view one wellness product","description":"","place_name":"","checkpoint_type":"discover"}
    ]'::jsonb,
    '',
    '',
    'Chalong Wellness Trail quest',
    '',
    false
  )
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    quest_type = excluded.quest_type,
    difficulty = excluded.difficulty,
    place_name = excluded.place_name,
    province = excluded.province,
    district = excluded.district,
    avg_duration = excluded.avg_duration,
    reward = excluded.reward,
    steps = excluded.steps,
    image_url = excluded.image_url,
    image_path = excluded.image_path,
    image_alt = excluded.image_alt,
    google_maps_url = excluded.google_maps_url,
    is_featured = excluded.is_featured,
    is_active = true;
