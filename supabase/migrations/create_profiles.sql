---
-- Create profiles table for admin flag and user metadata
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  full_name text,
  is_admin boolean default false
);
