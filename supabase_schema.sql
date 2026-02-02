-- Create Categories Table
create table categories (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  slug text not null unique,
  sort_order int default 0
);

-- Create Menu Items Table
create table menu_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,
  description text,
  price int not null, -- Stored in INR (e.g., 250 for ₹250)
  image_url text,
  is_available boolean default true,
  sort_order int default 0
);

-- Enable RLS
alter table categories enable row level security;
alter table menu_items enable row level security;

-- Policies for Categories
-- Public read access
create policy "Public categories are viewable by everyone"
  on categories for select
  using ( true );

-- Admin full access (assuming authenticated users with specific email or role, 
-- effectively allowing all authenticated users for this simple demo, 
-- or you can restrict to specific UIDs)
create policy "Admins can insert categories"
  on categories for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update categories"
  on categories for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete categories"
  on categories for delete
  using ( auth.role() = 'authenticated' );

-- Policies for Menu Items
-- Public read access
create policy "Public menu items are viewable by everyone"
  on menu_items for select
  using ( true );

-- Admin full access
create policy "Admins can insert menu items"
  on menu_items for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update menu items"
  on menu_items for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete menu items"
  on menu_items for delete
  using ( auth.role() = 'authenticated' );

-- Storage Bucket for Images
insert into storage.buckets (id, name, public) 
values ('menu-images', 'menu-images', true);

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'menu-images' );

create policy "Auth Upload"
  on storage.objects for insert
  with check ( bucket_id = 'menu-images' and auth.role() = 'authenticated' );

create policy "Auth Update"
  on storage.objects for update
  with check ( bucket_id = 'menu-images' and auth.role() = 'authenticated' );

create policy "Auth Delete"
  on storage.objects for delete
  using ( bucket_id = 'menu-images' and auth.role() = 'authenticated' );
