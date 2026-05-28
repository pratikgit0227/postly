-- Run this in your Supabase SQL editor

create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null default '',
  platforms text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at timestamptz,
  published_at timestamptz,
  tweet_splits text[],
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists post_analytics (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  platform text not null,
  impressions integer default 0,
  likes integer default 0,
  reposts integer default 0,
  replies integer default 0,
  clicks integer default 0,
  recorded_at timestamptz default now() not null
);

create table if not exists connected_accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  platform text not null,
  username text not null,
  display_name text,
  avatar_url text,
  access_token text,
  refresh_token text,
  connected_at timestamptz default now() not null,
  unique(user_id, platform)
);

-- Enable Row Level Security
alter table posts enable row level security;
alter table post_analytics enable row level security;
alter table connected_accounts enable row level security;

-- Policies
create policy "Users can manage their own posts"
  on posts for all using (auth.uid() = user_id);

create policy "Users can view their own analytics"
  on post_analytics for select using (
    exists (select 1 from posts where posts.id = post_analytics.post_id and posts.user_id = auth.uid())
  );

create policy "Users can manage their own connected accounts"
  on connected_accounts for all using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function update_updated_at();
