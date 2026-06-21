-- Run this once in the Supabase SQL Editor.
-- OTOP stores villages separately from product/service items.
-- Product/service images are MVP fields that can be left blank until Supabase
-- Storage assets are uploaded.

create extension if not exists pgcrypto;

do $$
begin
  create type public.otop_item_type as enum ('product', 'service');
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.otop_category as enum (
    'food',
    'craft',
    'wellness',
    'marine',
    'culture'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.otop_crowd_density as enum ('low', 'medium', 'high');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.otop_villages (
  village_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  province text not null,
  district text,
  subdistrict text,
  place_name text,
  description text not null,
  history text not null default '',
  wisdom text[] not null default '{}',
  highlights text[] not null default '{}',
  category public.otop_category not null,
  google_maps_url text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  cover_image_url text not null default '',
  cover_image_path text not null default '',
  cover_image_alt text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.otop_product_services (
  item_id uuid primary key default gen_random_uuid(),
  village_id uuid not null references public.otop_villages(village_id) on delete cascade,
  slug text not null unique,
  name text not null,
  item_type public.otop_item_type not null,
  category public.otop_category not null,
  description text not null,
  detail text not null default '',
  province text not null,
  district text,
  subdistrict text,
  place_name text,
  price_amount numeric(10, 2) not null default 0 check (price_amount >= 0),
  price_label text not null default '',
  currency text not null default 'THB',
  image_url text not null default '',
  image_path text not null default '',
  image_alt text,
  google_maps_url text,
  opening_hours jsonb not null default '{"type":"unknown","note":"","days":{}}'::jsonb,
  crowd_density public.otop_crowd_density not null default 'medium',
  contact_phone text,
  contact_line text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists otop_villages_slug_idx on public.otop_villages(slug);
create index if not exists otop_villages_category_idx on public.otop_villages(category);
create index if not exists otop_villages_province_idx on public.otop_villages(province);
create index if not exists otop_villages_active_idx on public.otop_villages(is_active);

create index if not exists otop_items_slug_idx on public.otop_product_services(slug);
create index if not exists otop_items_village_id_idx on public.otop_product_services(village_id);
create index if not exists otop_items_item_type_idx on public.otop_product_services(item_type);
create index if not exists otop_items_category_idx on public.otop_product_services(category);
create index if not exists otop_items_province_idx on public.otop_product_services(province);
create index if not exists otop_items_featured_idx on public.otop_product_services(is_featured);
create index if not exists otop_items_active_idx on public.otop_product_services(is_active);

create or replace function public.otop_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists otop_villages_set_updated_at on public.otop_villages;
create trigger otop_villages_set_updated_at
before update on public.otop_villages
for each row
execute function public.otop_set_updated_at();

drop trigger if exists otop_items_set_updated_at on public.otop_product_services;
create trigger otop_items_set_updated_at
before update on public.otop_product_services
for each row
execute function public.otop_set_updated_at();

alter table public.otop_villages enable row level security;
alter table public.otop_product_services enable row level security;

grant select on public.otop_villages to anon, authenticated;
grant select on public.otop_product_services to anon, authenticated;

drop policy if exists "Public can read active otop villages" on public.otop_villages;
create policy "Public can read active otop villages"
on public.otop_villages
for select
using (is_active = true);

drop policy if exists "Public can read active otop product services" on public.otop_product_services;
create policy "Public can read active otop product services"
on public.otop_product_services
for select
using (is_active = true);

insert into public.otop_villages (
  slug,
  name,
  province,
  district,
  subdistrict,
  place_name,
  description,
  history,
  wisdom,
  highlights,
  category,
  google_maps_url,
  latitude,
  longitude,
  cover_image_url,
  cover_image_path,
  cover_image_alt
) values
  (
    'ban-bang-rong',
    'Ban Bang Rong',
    'Phuket',
    'Thalang',
    'Pa Khlok',
    'Ban Bang Rong Community',
    'A mangrove community known for local food, coastal culture, and slow travel routes.',
    'Ban Bang Rong grew around mangrove livelihoods, small coastal food networks, and community-led conservation. The village is known for connecting local tourism with marine ecosystem care, where visitors can learn how daily life, food, and nature support one another.',
    array['Mangrove conservation knowledge', 'Local seafood preparation', 'Community-based tourism operation'],
    array['Mangrove learning route', 'Local food and service booths', 'Marine-friendly community activities'],
    'marine',
    '',
    null,
    null,
    '',
    '',
    'Ban Bang Rong mangrove community'
  ),
  (
    'ban-kathu-craft',
    'Ban Kathu Craft',
    'Phuket',
    'Kathu',
    'Kathu',
    'Kathu Craft Community',
    'Small makers preserving Phuket craft stories through baskets, fabric, and home goods.',
    'Ban Kathu Craft represents a maker community that keeps local handcraft stories alive through everyday objects. Its products connect household skills, local material knowledge, and tourism demand in a way that helps small makers earn from cultural value.',
    array['Basketry and weaving techniques', 'Local material selection', 'Handmade product finishing'],
    array['Craft maker route', 'Handwoven basket products', 'Small workshop-style experience'],
    'craft',
    '',
    null,
    null,
    '',
    '',
    'Handmade craft community in Kathu'
  ),
  (
    'old-town-heritage',
    'Old Town Heritage',
    'Phuket',
    'Mueang Phuket',
    'Talat Yai',
    'Old Phuket Town',
    'A culture-led village route connecting local snacks, Sino-Portuguese stories, and shops.',
    'Old Town Heritage is shaped by Phuket''s trading history, architecture, and food culture. The area brings together small shops, local snacks, and cultural routes that help visitors understand how the city grew through community, trade, and craft.',
    array['Local snack recipes', 'Sino-Portuguese heritage storytelling', 'Community shop curation'],
    array['Old town walking route', 'Local snack discovery', 'Heritage shop experience'],
    'culture',
    '',
    null,
    null,
    '',
    '',
    'Old Phuket Town heritage route'
  ),
  (
    'rawai-sea-village',
    'Rawai Sea Village',
    'Phuket',
    'Mueang Phuket',
    'Rawai',
    'Rawai Sea Village',
    'Community services and marine-inspired products connected to responsible coastal visits.',
    'Rawai Sea Village connects coastal livelihoods with visitor services and marine-inspired products. The community experience is built around local knowledge of the sea, food, and responsible visits that respect the rhythm of coastal life.',
    array['Coastal livelihood knowledge', 'Marine food culture', 'Responsible visitor hosting'],
    array['Coastal community services', 'Cooking and food experiences', 'Marine-inspired local products'],
    'marine',
    '',
    null,
    null,
    '',
    '',
    'Rawai coastal community'
  ),
  (
    'chalong-wellness',
    'Chalong Wellness',
    'Phuket',
    'Mueang Phuket',
    'Chalong',
    'Chalong Wellness Community',
    'Local wellness makers offering herbs, massage knowledge, and mindful visitor experiences.',
    'Chalong Wellness focuses on local health knowledge, herbs, and mindful services. The community route is designed for visitors who want to understand wellness as local wisdom rather than only a tourism product.',
    array['Herbal compress knowledge', 'Local wellness product making', 'Massage and relaxation practices'],
    array['Herbal product discovery', 'Wellness partner visit', 'Mindful service experience'],
    'wellness',
    '',
    null,
    null,
    '',
    '',
    'Chalong local wellness community'
  )
on conflict (slug) do update
set name = excluded.name,
    province = excluded.province,
    district = excluded.district,
    subdistrict = excluded.subdistrict,
    place_name = excluded.place_name,
    description = excluded.description,
    history = excluded.history,
    wisdom = excluded.wisdom,
    highlights = excluded.highlights,
    category = excluded.category,
    google_maps_url = excluded.google_maps_url,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    cover_image_url = excluded.cover_image_url,
    cover_image_path = excluded.cover_image_path,
    cover_image_alt = excluded.cover_image_alt,
    is_active = true;

insert into public.otop_product_services (
  village_id,
  slug,
  name,
  item_type,
  category,
  description,
  detail,
  province,
  district,
  subdistrict,
  place_name,
  price_amount,
  price_label,
  currency,
  image_url,
  image_path,
  image_alt,
  google_maps_url,
  opening_hours,
  crowd_density,
  contact_phone,
  contact_line,
  is_featured
) values
  (
    (select village_id from public.otop_villages where slug = 'old-town-heritage'),
    'phuket-pineapple-jam',
    'Phuket Pineapple Jam',
    'product',
    'food',
    'Local pineapple jam made for snacks, souvenirs, and breakfast sets.',
    'A sweet Phuket food product suitable for small gifts and local market shelves.',
    'Phuket',
    'Mueang Phuket',
    'Talat Yai',
    'Old Phuket Town',
    120,
    '฿120',
    'THB',
    '',
    '',
    'Phuket pineapple jam jar',
    '',
    '{"type":"weekly","note":"Everyday","days":{"monday":{"open":true,"from":"09:00","to":"18:00"},"tuesday":{"open":true,"from":"09:00","to":"18:00"},"wednesday":{"open":true,"from":"09:00","to":"18:00"},"thursday":{"open":true,"from":"09:00","to":"18:00"},"friday":{"open":true,"from":"09:00","to":"18:00"},"saturday":{"open":true,"from":"09:00","to":"18:00"},"sunday":{"open":true,"from":"09:00","to":"18:00"}}}'::jsonb,
    'medium',
    '',
    '',
    true
  ),
  (
    (select village_id from public.otop_villages where slug = 'ban-kathu-craft'),
    'handwoven-basket-set',
    'Handwoven Basket Set',
    'product',
    'craft',
    'Handwoven basket products made by local craft makers.',
    'A handmade craft set using local material knowledge and basketry finishing.',
    'Phuket',
    'Kathu',
    'Kathu',
    'Kathu Craft Community',
    450,
    '฿450',
    'THB',
    '',
    '',
    'Handwoven basket set',
    '',
    '{"type":"weekly","note":"Monday-Saturday","days":{"monday":{"open":true,"from":"10:00","to":"17:00"},"tuesday":{"open":true,"from":"10:00","to":"17:00"},"wednesday":{"open":true,"from":"10:00","to":"17:00"},"thursday":{"open":true,"from":"10:00","to":"17:00"},"friday":{"open":true,"from":"10:00","to":"17:00"},"saturday":{"open":true,"from":"10:00","to":"16:00"},"sunday":{"open":false}}}'::jsonb,
    'low',
    '',
    '',
    true
  ),
  (
    (select village_id from public.otop_villages where slug = 'ban-bang-rong'),
    'mangrove-local-walk',
    'Mangrove Local Walk',
    'service',
    'marine',
    'Community-guided mangrove route for visitors.',
    'A slow travel service that introduces mangrove ecology, community food, and coastal culture.',
    'Phuket',
    'Thalang',
    'Pa Khlok',
    'Ban Bang Rong Community',
    350,
    '฿350 / person',
    'THB',
    '',
    '',
    'Mangrove local walk',
    '',
    '{"type":"weekly","note":"Tuesday-Friday","days":{"monday":{"open":false},"tuesday":{"open":true,"from":"09:00","to":"17:00"},"wednesday":{"open":true,"from":"09:00","to":"17:00"},"thursday":{"open":true,"from":"09:00","to":"17:00"},"friday":{"open":true,"from":"09:00","to":"17:00"},"saturday":{"open":true,"from":"09:00","to":"15:00"},"sunday":{"open":false}}}'::jsonb,
    'medium',
    '',
    '',
    true
  ),
  (
    (select village_id from public.otop_villages where slug = 'chalong-wellness'),
    'herbal-compress-session',
    'Herbal Compress Session',
    'service',
    'wellness',
    'Local wellness session using herbal compress knowledge.',
    'A visitor-friendly wellness service focused on herbs, massage practice, and relaxation.',
    'Phuket',
    'Mueang Phuket',
    'Chalong',
    'Chalong Wellness Community',
    590,
    '฿590',
    'THB',
    '',
    '',
    'Herbal compress wellness session',
    '',
    '{"type":"weekly","note":"Everyday","days":{"monday":{"open":true,"from":"10:00","to":"19:00"},"tuesday":{"open":true,"from":"10:00","to":"19:00"},"wednesday":{"open":true,"from":"10:00","to":"19:00"},"thursday":{"open":true,"from":"10:00","to":"19:00"},"friday":{"open":true,"from":"10:00","to":"19:00"},"saturday":{"open":true,"from":"10:00","to":"19:00"},"sunday":{"open":true,"from":"10:00","to":"19:00"}}}'::jsonb,
    'high',
    '',
    '',
    false
  ),
  (
    (select village_id from public.otop_villages where slug = 'old-town-heritage'),
    'batik-memory-card',
    'Batik Memory Card',
    'product',
    'culture',
    'Small batik-inspired souvenir card.',
    'A compact cultural product suitable for postcards, gifts, and travel keepsakes.',
    'Phuket',
    'Mueang Phuket',
    'Talat Yai',
    'Old Phuket Town',
    180,
    '฿180',
    'THB',
    '',
    '',
    'Batik memory card',
    '',
    '{"type":"weekly","note":"Everyday","days":{"monday":{"open":true,"from":"09:00","to":"18:00"},"tuesday":{"open":true,"from":"09:00","to":"18:00"},"wednesday":{"open":true,"from":"09:00","to":"18:00"},"thursday":{"open":true,"from":"09:00","to":"18:00"},"friday":{"open":true,"from":"09:00","to":"18:00"},"saturday":{"open":true,"from":"09:00","to":"18:00"},"sunday":{"open":true,"from":"09:00","to":"18:00"}}}'::jsonb,
    'medium',
    '',
    '',
    false
  ),
  (
    (select village_id from public.otop_villages where slug = 'rawai-sea-village'),
    'local-cooking-mini-class',
    'Local Cooking Mini Class',
    'service',
    'food',
    'Small community cooking class connected to local coastal food.',
    'A visitor service for learning local food culture in a coastal community setting.',
    'Phuket',
    'Mueang Phuket',
    'Rawai',
    'Rawai Sea Village',
    790,
    '฿790 / person',
    'THB',
    '',
    '',
    'Local cooking mini class',
    '',
    '{"type":"weekly","note":"Friday-Sunday","days":{"monday":{"open":false},"tuesday":{"open":false},"wednesday":{"open":false},"thursday":{"open":false},"friday":{"open":true,"from":"11:00","to":"16:00"},"saturday":{"open":true,"from":"11:00","to":"16:00"},"sunday":{"open":true,"from":"11:00","to":"16:00"}}}'::jsonb,
    'high',
    '',
    '',
    true
  )
on conflict (slug) do update
set village_id = excluded.village_id,
    name = excluded.name,
    item_type = excluded.item_type,
    category = excluded.category,
    description = excluded.description,
    detail = excluded.detail,
    province = excluded.province,
    district = excluded.district,
    subdistrict = excluded.subdistrict,
    place_name = excluded.place_name,
    price_amount = excluded.price_amount,
    price_label = excluded.price_label,
    currency = excluded.currency,
    image_url = excluded.image_url,
    image_path = excluded.image_path,
    image_alt = excluded.image_alt,
    google_maps_url = excluded.google_maps_url,
    opening_hours = excluded.opening_hours,
    crowd_density = excluded.crowd_density,
    contact_phone = excluded.contact_phone,
    contact_line = excluded.contact_line,
    is_featured = excluded.is_featured,
    is_active = true;
