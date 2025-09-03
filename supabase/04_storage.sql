-- Create public bucket for organization logos
insert into storage.buckets (id, name, public)
values ('organization-logos', 'organization-logos', true)
on conflict (id) do nothing;

-- Ensure RLS is enabled on storage.objects
alter table storage.objects enable row level security;

-- Public read for this bucket (bucket is public, this helps API queries)
drop policy if exists "storage read organization-logos" on storage.objects;
create policy "storage read organization-logos" on storage.objects for select to public using (
  bucket_id = 'organization-logos'
);

-- Allow authenticated org members to upload/delete under <org_id>/...
drop policy if exists "storage insert organization-logos by members" on storage.objects;
create policy "storage insert organization-logos by members" on storage.objects for insert to authenticated with check (
  bucket_id = 'organization-logos'
  and exists(
    select 1 from public.organization_members m
    where m.user_id = auth.uid()
      and m.organization_id = uuid(split_part(new.name, '/', 1))
  )
);

drop policy if exists "storage delete organization-logos by members" on storage.objects;
create policy "storage delete organization-logos by members" on storage.objects for delete to authenticated using (
  bucket_id = 'organization-logos'
  and exists(
    select 1 from public.organization_members m
    where m.user_id = auth.uid()
      and m.organization_id = uuid(split_part(name, '/', 1))
  )
);

