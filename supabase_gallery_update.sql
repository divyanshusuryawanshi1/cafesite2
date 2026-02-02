-- Create Gallery Images Table
create table gallery_images (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  image_url text not null,
  alt_text text
);

-- Enable RLS
alter table gallery_images enable row level security;

-- Public read access
create policy "Public gallery images are viewable by everyone"
  on gallery_images for select
  using ( true );

-- Admin full access
create policy "Admins can insert gallery images"
  on gallery_images for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can delete gallery images"
  on gallery_images for delete
  using ( auth.role() = 'authenticated' );

-- Update Storage Policy to allow Gallery Uploads (if not already covered)
-- We'll reuse the 'menu-images' bucket for simplicity, or create a new one.
-- Let's just create a generic 'images' bucket to be safe or ensure 'menu-images' is open.
-- For this script, we'll assume we continue using 'menu-images' bucket for all site images.
