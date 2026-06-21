-- Run this once in the Supabase SQL Editor.
-- Shop stores Phuket stores, services, products, and markets in one MVP table.

create extension if not exists pgcrypto;

do $$
begin
  create type public.shop_item_type as enum (
    'store',
    'service',
    'product',
    'market'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.shop_category as enum (
    'market',
    'service',
    'wellness',
    'food',
    'craft',
    'marine'
  );
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.shop_items (
  item_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  seller_name text not null,
  description text not null default '',
  item_type public.shop_item_type not null,
  category public.shop_category not null,
  province text not null default 'Phuket',
  district text,
  location_name text,
  price_amount numeric(10, 2) check (price_amount is null or price_amount >= 0),
  price_label text not null default '',
  currency text not null default 'THB',
  rating numeric(2, 1) check (rating is null or (rating >= 0 and rating <= 5)),
  image_url text not null default '',
  image_path text not null default '',
  image_alt text,
  google_maps_url text,
  contact_phone text,
  contact_line text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists shop_items_slug_idx on public.shop_items(slug);
create index if not exists shop_items_item_type_idx on public.shop_items(item_type);
create index if not exists shop_items_category_idx on public.shop_items(category);
create index if not exists shop_items_district_idx on public.shop_items(district);
create index if not exists shop_items_featured_idx on public.shop_items(is_featured);
create index if not exists shop_items_active_idx on public.shop_items(is_active);

create or replace function public.shop_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists shop_items_set_updated_at on public.shop_items;
create trigger shop_items_set_updated_at
before update on public.shop_items
for each row
execute function public.shop_set_updated_at();

alter table public.shop_items enable row level security;

grant select on public.shop_items to anon, authenticated;

drop policy if exists "Public can read active shop items" on public.shop_items;
create policy "Public can read active shop items"
on public.shop_items
for select
using (is_active = true);

insert into public.shop_items (
  slug,
  name,
  seller_name,
  description,
  item_type,
  category,
  province,
  district,
  location_name,
  price_amount,
  price_label,
  currency,
  rating,
  image_url,
  image_path,
  image_alt,
  google_maps_url,
  contact_phone,
  contact_line,
  is_featured
) values
  (
    'old-town-weekend-basket',
    'Old Town Weekend Basket',
    'Ban Kathu Craft',
    'A local basket product bundle for weekend shopping and Phuket craft souvenirs.',
    'product',
    'market',
    'Phuket',
    'Kathu',
    'Kathu Craft Community',
    450,
    '฿450',
    'THB',
    4.8,
    '',
    '',
    'Old Town weekend basket',
    '',
    '',
    '',
    true
  ),
  (
    'mangrove-local-walk',
    'Mangrove Local Walk',
    'Ban Bang Rong',
    'A community service experience for mangrove learning and slow coastal travel.',
    'service',
    'service',
    'Phuket',
    'Thalang',
    'Ban Bang Rong Community',
    350,
    '฿350 / person',
    'THB',
    4.9,
    '',
    '',
    'Mangrove local walk',
    '',
    '',
    '',
    true
  ),
  (
    'herbal-compress-session',
    'Herbal Compress Session',
    'Chalong Wellness',
    'A local wellness service using herbal compress knowledge and relaxation practice.',
    'service',
    'wellness',
    'Phuket',
    'Mueang Phuket',
    'Chalong Wellness Community',
    590,
    '฿590',
    'THB',
    4.7,
    '',
    '',
    'Herbal compress session',
    '',
    '',
    '',
    false
  ),
  (
    'phuket-pineapple-jam',
    'Phuket Pineapple Jam',
    'Old Town Heritage',
    'Local pineapple jam for snacks, gifts, and breakfast sets.',
    'product',
    'food',
    'Phuket',
    'Mueang Phuket',
    'Old Phuket Town',
    120,
    '฿120',
    'THB',
    4.6,
    '',
    '',
    'Phuket pineapple jam',
    '',
    '',
    '',
    true
  ),
  (
    'batik-memory-card',
    'Batik Memory Card',
    'Old Town Heritage',
    'A compact batik-inspired souvenir card for travel memories and gifts.',
    'product',
    'craft',
    'Phuket',
    'Mueang Phuket',
    'Old Phuket Town',
    180,
    '฿180',
    'THB',
    4.8,
    '',
    '',
    'Batik memory card',
    '',
    '',
    '',
    false
  ),
  (
    'rawai-cooking-mini-class',
    'Rawai Cooking Mini Class',
    'Rawai Sea Village',
    'A local cooking experience connected to coastal food culture.',
    'service',
    'marine',
    'Phuket',
    'Mueang Phuket',
    'Rawai Sea Village',
    790,
    '฿790 / person',
    'THB',
    4.9,
    '',
    '',
    'Rawai cooking mini class',
    '',
    '',
    '',
    true
  ),
  (
    'sunday-walking-market-pass',
    'Sunday Walking Market Pass',
    'Old Town Heritage',
    'A walking market route for discovering local snacks, crafts, and community sellers.',
    'market',
    'market',
    'Phuket',
    'Mueang Phuket',
    'Old Phuket Town',
    null,
    'Free entry',
    'THB',
    4.7,
    '',
    '',
    'Sunday walking market route',
    '',
    '',
    '',
    true
  ),
  (
    'local-wellness-tea-set',
    'Local Wellness Tea Set',
    'Chalong Wellness',
    'A wellness tea product set made for mindful Phuket travel gifts.',
    'product',
    'wellness',
    'Phuket',
    'Mueang Phuket',
    'Chalong Wellness Community',
    260,
    '฿260',
    'THB',
    4.6,
    '',
    '',
    'Local wellness tea set',
    '',
    '',
    '',
    false
  ),
  (
    'island-transfer-helper',
    'Island Transfer Helper',
    'Rawai Sea Village',
    'A local service that helps visitors coordinate coastal and island transfer needs.',
    'service',
    'service',
    'Phuket',
    'Mueang Phuket',
    'Rawai Sea Village',
    300,
    '฿300+',
    'THB',
    4.5,
    '',
    '',
    'Island transfer helper',
    '',
    '',
    '',
    false
  )
on conflict (slug) do update
set name = excluded.name,
    seller_name = excluded.seller_name,
    description = excluded.description,
    item_type = excluded.item_type,
    category = excluded.category,
    province = excluded.province,
    district = excluded.district,
    location_name = excluded.location_name,
    price_amount = excluded.price_amount,
    price_label = excluded.price_label,
    currency = excluded.currency,
    rating = excluded.rating,
    image_url = excluded.image_url,
    image_path = excluded.image_path,
    image_alt = excluded.image_alt,
    google_maps_url = excluded.google_maps_url,
    contact_phone = excluded.contact_phone,
    contact_line = excluded.contact_line,
    is_featured = excluded.is_featured,
    is_active = true;
