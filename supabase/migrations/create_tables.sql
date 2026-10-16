-- Supabase migrations for ReelSpot AI

-- payments table
create extension if not exists pgcrypto;

create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  method text,
  tx_id text,
  proof_path text,
  amount numeric(10,2) default 0,
  currency text default 'INR',
  status text default 'pending',
  verified_by uuid references auth.users(id),
  verified_at timestamptz
);

-- subscriptions
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) unique,
  plan text,
  status text,
  started_at timestamptz,
  ends_at timestamptz,
  monthly_allowance int default 0,
  remaining_credits int default 0
);

-- generation credits audit
create table if not exists generation_credits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  change int,
  reason text,
  created_at timestamptz default now()
);
