-- Run this once in the Supabase SQL Editor.
-- Reward stores the public MVP catalog for discounts, gifts, vouchers, badges,
-- and partner bundles.

create extension if not exists pgcrypto;

do $$
begin
  create type public.reward_type as enum (
    'percent_discount',
    'money_discount',
    'gift',
    'voucher',
    'badge',
    'partner_bundle'
  );
exception
  when duplicate_object then null;
end
$$;

do $$
begin
  create type public.reward_status as enum ('available', 'used', 'expired');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.reward_items (
  reward_id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  partner_name text not null default '',
  reward_type public.reward_type not null,
  status public.reward_status not null default 'available',
  discount_percent numeric(5, 2) check (
    discount_percent is null or (discount_percent >= 0 and discount_percent <= 100)
  ),
  discount_amount numeric(10, 2) check (
    discount_amount is null or discount_amount >= 0
  ),
  voucher_value text,
  display_value text not null default '',
  minimum_spend_amount numeric(10, 2) check (
    minimum_spend_amount is null or minimum_spend_amount >= 0
  ),
  minimum_spend_label text not null default '',
  valid_until date,
  valid_until_label text not null default '',
  location_name text,
  condition text not null default '',
  redemption_code text not null default '',
  limited_quantity boolean not null default false,
  quantity_limit integer check (quantity_limit is null or quantity_limit >= 0),
  quantity_remaining integer check (
    quantity_remaining is null or quantity_remaining >= 0
  ),
  image_url text not null default '',
  image_path text not null default '',
  image_alt text,
  google_maps_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reward_items_slug_idx on public.reward_items(slug);
create index if not exists reward_items_reward_type_idx on public.reward_items(reward_type);
create index if not exists reward_items_status_idx on public.reward_items(status);
create index if not exists reward_items_featured_idx on public.reward_items(is_featured);
create index if not exists reward_items_active_idx on public.reward_items(is_active);

create or replace function public.reward_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reward_items_set_updated_at on public.reward_items;
create trigger reward_items_set_updated_at
before update on public.reward_items
for each row
execute function public.reward_set_updated_at();

alter table public.reward_items enable row level security;

grant select on public.reward_items to anon, authenticated;

drop policy if exists "Public can read active reward items" on public.reward_items;
create policy "Public can read active reward items"
on public.reward_items
for select
using (is_active = true);

insert into public.reward_items (
  slug,
  name,
  description,
  partner_name,
  reward_type,
  status,
  discount_percent,
  discount_amount,
  voucher_value,
  display_value,
  minimum_spend_amount,
  minimum_spend_label,
  valid_until,
  valid_until_label,
  location_name,
  condition,
  redemption_code,
  limited_quantity,
  quantity_limit,
  quantity_remaining,
  image_url,
  image_path,
  image_alt,
  google_maps_url,
  is_featured
) values
  (
    'old-town-10-percent',
    'Save 10% at Old Town Heritage',
    'A percentage discount for local snacks, craft cards, and selected souvenirs.',
    'Old Town Heritage',
    'percent_discount',
    'available',
    10,
    null,
    null,
    '10% off',
    300,
    'Minimum spend ฿300',
    '2026-06-30',
    '30 Jun 2026',
    'Old Phuket Town',
    'Valid for local snacks, craft cards, and selected souvenirs.',
    'PD-OTOP10',
    false,
    null,
    null,
    '',
    '',
    'Save 10% at Old Town Heritage',
    '',
    true
  ),
  (
    'bang-rong-50-baht',
    '฿50 Bang Rong Community Credit',
    'A fixed baht discount for participating local food or service booths.',
    'Ban Bang Rong',
    'money_discount',
    'available',
    null,
    50,
    null,
    '฿50 off',
    250,
    'Minimum spend ฿250',
    '2026-07-15',
    '15 Jul 2026',
    'Thalang',
    'Can be used with participating local food or service booths.',
    'PD-BR50',
    true,
    100,
    64,
    '',
    '',
    'Bang Rong Community Credit',
    '',
    true
  ),
  (
    'chalong-herbal-trial',
    'Free Herbal Trial Pack',
    'A free sample reward from Chalong Wellness while supplies last.',
    'Chalong Wellness',
    'gift',
    'available',
    null,
    null,
    'Free herbal trial pack',
    'Free sample',
    null,
    'No minimum spend',
    '2026-07-10',
    '10 Jul 2026',
    'Chalong',
    'One free trial pack per user while supplies last.',
    'PD-HERB',
    true,
    80,
    22,
    '',
    '',
    'Free Herbal Trial Pack',
    '',
    false
  ),
  (
    'marine-explorer-badge',
    'Marine Friendly Explorer Badge',
    'A digital badge awarded after completing a marine community quest.',
    'Rawai Sea Village',
    'badge',
    'used',
    null,
    null,
    'Marine friendly explorer badge',
    'Digital badge',
    null,
    'Quest completion required',
    null,
    'Claimed on 12 Jun 2026',
    'Rawai',
    'Awarded after completing a marine community quest.',
    'PD-MARINE',
    false,
    null,
    null,
    '',
    '',
    'Marine Friendly Explorer Badge',
    '',
    false
  ),
  (
    'partner-market-pass',
    'Cross-Partner Market Pass',
    'A partner bundle reward valid across selected village and market partners.',
    'PaiTiew Partners',
    'partner_bundle',
    'expired',
    null,
    null,
    'Partner bundle',
    'Partner bundle',
    null,
    'Quest passport required',
    '2026-06-01',
    'Expired 01 Jun 2026',
    'Phuket province',
    'Valid across selected village and market partners.',
    'PD-PASS',
    false,
    null,
    null,
    '',
    '',
    'Cross-Partner Market Pass',
    '',
    false
  )
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    partner_name = excluded.partner_name,
    reward_type = excluded.reward_type,
    status = excluded.status,
    discount_percent = excluded.discount_percent,
    discount_amount = excluded.discount_amount,
    voucher_value = excluded.voucher_value,
    display_value = excluded.display_value,
    minimum_spend_amount = excluded.minimum_spend_amount,
    minimum_spend_label = excluded.minimum_spend_label,
    valid_until = excluded.valid_until,
    valid_until_label = excluded.valid_until_label,
    location_name = excluded.location_name,
    condition = excluded.condition,
    redemption_code = excluded.redemption_code,
    limited_quantity = excluded.limited_quantity,
    quantity_limit = excluded.quantity_limit,
    quantity_remaining = excluded.quantity_remaining,
    image_url = excluded.image_url,
    image_path = excluded.image_path,
    image_alt = excluded.image_alt,
    google_maps_url = excluded.google_maps_url,
    is_featured = excluded.is_featured,
    is_active = true;
