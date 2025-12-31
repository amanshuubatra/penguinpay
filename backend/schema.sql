-- Enable UUID extension for Supabase
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password_hash text not null,
  role text default 'user' check (role in ('user', 'admin', 'creator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Creators Table
create table if not exists public.creators (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  display_name text not null,
  upi_id text,
  total_earnings numeric default 0 check (total_earnings >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- 3. Payments Table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  creator_id uuid references public.creators(id) not null,
  amount numeric not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Optional: Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.creators enable row level security;
alter table public.payments enable row level security;

-- Optional: Policies (Basic examples)
-- Users can see their own data
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

-- Public can view creators
create policy "Public can view creators" on public.creators
  for select using (true);
