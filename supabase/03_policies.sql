-- Enable RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invitations enable row level security;
alter table public.organization_settings enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.time_entries enable row level security;
alter table public.notifications enable row level security;

-- profiles: own-only access
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- organizations
drop policy if exists "organizations select for members" on public.organizations;
create policy "organizations select for members" on public.organizations for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organizations.id and m.user_id = auth.uid())
);
drop policy if exists "organizations insert owner only" on public.organizations;
create policy "organizations insert owner only" on public.organizations for insert to authenticated with check (owner_id = auth.uid());
drop policy if exists "organizations update owner only" on public.organizations;
create policy "organizations update owner only" on public.organizations for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "organizations delete owner only" on public.organizations;
create policy "organizations delete owner only" on public.organizations for delete to authenticated using (owner_id = auth.uid());

-- organization_members
drop policy if exists "org_members select for members" on public.organization_members;
create policy "org_members select for members" on public.organization_members for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_members.organization_id and m.user_id = auth.uid())
);
drop policy if exists "org_members insert by admins" on public.organization_members;
create policy "org_members insert by admins" on public.organization_members for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
drop policy if exists "org_members update by admins" on public.organization_members;
create policy "org_members update by admins" on public.organization_members for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_members.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_members.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
drop policy if exists "org_members delete by admins" on public.organization_members;
create policy "org_members delete by admins" on public.organization_members for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_members.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);

-- organization_invitations
drop policy if exists "org_invites select by admins" on public.organization_invitations;
create policy "org_invites select by admins" on public.organization_invitations for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_invitations.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
drop policy if exists "org_invites insert by admins" on public.organization_invitations;
create policy "org_invites insert by admins" on public.organization_invitations for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
drop policy if exists "org_invites update by admins" on public.organization_invitations;
create policy "org_invites update by admins" on public.organization_invitations for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_invitations.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_invitations.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
drop policy if exists "org_invites delete by admins" on public.organization_invitations;
create policy "org_invites delete by admins" on public.organization_invitations for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_invitations.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);

-- organization_settings
drop policy if exists "org_settings select by members" on public.organization_settings;
create policy "org_settings select by members" on public.organization_settings for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_settings.organization_id and m.user_id = auth.uid())
);
drop policy if exists "org_settings upsert by admins" on public.organization_settings;
create policy "org_settings upsert by admins" on public.organization_settings for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);
drop policy if exists "org_settings update by admins" on public.organization_settings;
create policy "org_settings update by admins" on public.organization_settings for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = organization_settings.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_settings.organization_id and m.user_id = auth.uid() and m.role in ('owner','admin'))
);

-- Generic org-bound: clients, projects, tasks, product_categories, products, invoices, invoice_items, payments, time_entries, notifications
-- clients
drop policy if exists "clients select by members" on public.clients;
create policy "clients select by members" on public.clients for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = clients.organization_id and m.user_id = auth.uid())
);
drop policy if exists "clients insert by members" on public.clients;
create policy "clients insert by members" on public.clients for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "clients update by members" on public.clients;
create policy "clients update by members" on public.clients for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = clients.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = clients.organization_id and m.user_id = auth.uid())
);
drop policy if exists "clients delete by members" on public.clients;
create policy "clients delete by members" on public.clients for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = clients.organization_id and m.user_id = auth.uid())
);

-- projects
drop policy if exists "projects select by members" on public.projects;
create policy "projects select by members" on public.projects for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = projects.organization_id and m.user_id = auth.uid())
);
drop policy if exists "projects insert by members" on public.projects;
create policy "projects insert by members" on public.projects for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "projects update by members" on public.projects;
create policy "projects update by members" on public.projects for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = projects.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = projects.organization_id and m.user_id = auth.uid())
);
drop policy if exists "projects delete by members" on public.projects;
create policy "projects delete by members" on public.projects for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = projects.organization_id and m.user_id = auth.uid())
);

-- tasks
drop policy if exists "tasks select by members" on public.tasks;
create policy "tasks select by members" on public.tasks for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = tasks.organization_id and m.user_id = auth.uid())
);
drop policy if exists "tasks insert by members" on public.tasks;
create policy "tasks insert by members" on public.tasks for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "tasks update by members" on public.tasks;
create policy "tasks update by members" on public.tasks for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = tasks.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = tasks.organization_id and m.user_id = auth.uid())
);
drop policy if exists "tasks delete by members" on public.tasks;
create policy "tasks delete by members" on public.tasks for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = tasks.organization_id and m.user_id = auth.uid())
);

-- product_categories
drop policy if exists "product_categories select by members" on public.product_categories;
create policy "product_categories select by members" on public.product_categories for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = product_categories.organization_id and m.user_id = auth.uid())
);
drop policy if exists "product_categories insert by members" on public.product_categories;
create policy "product_categories insert by members" on public.product_categories for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "product_categories update by members" on public.product_categories;
create policy "product_categories update by members" on public.product_categories for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = product_categories.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = product_categories.organization_id and m.user_id = auth.uid())
);
drop policy if exists "product_categories delete by members" on public.product_categories;
create policy "product_categories delete by members" on public.product_categories for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = product_categories.organization_id and m.user_id = auth.uid())
);

-- products
drop policy if exists "products select by members" on public.products;
create policy "products select by members" on public.products for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = products.organization_id and m.user_id = auth.uid())
);
drop policy if exists "products insert by members" on public.products;
create policy "products insert by members" on public.products for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "products update by members" on public.products;
create policy "products update by members" on public.products for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = products.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = products.organization_id and m.user_id = auth.uid())
);
drop policy if exists "products delete by members" on public.products;
create policy "products delete by members" on public.products for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = products.organization_id and m.user_id = auth.uid())
);

-- invoices
drop policy if exists "invoices select by members" on public.invoices;
create policy "invoices select by members" on public.invoices for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = invoices.organization_id and m.user_id = auth.uid())
);
drop policy if exists "invoices insert by members" on public.invoices;
create policy "invoices insert by members" on public.invoices for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "invoices update by members" on public.invoices;
create policy "invoices update by members" on public.invoices for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = invoices.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = invoices.organization_id and m.user_id = auth.uid())
);
drop policy if exists "invoices delete by members" on public.invoices;
create policy "invoices delete by members" on public.invoices for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = invoices.organization_id and m.user_id = auth.uid())
);

-- invoice_items
drop policy if exists "invoice_items select by members" on public.invoice_items;
create policy "invoice_items select by members" on public.invoice_items for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = invoice_items.organization_id and m.user_id = auth.uid())
);
drop policy if exists "invoice_items insert by members" on public.invoice_items;
create policy "invoice_items insert by members" on public.invoice_items for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "invoice_items update by members" on public.invoice_items;
create policy "invoice_items update by members" on public.invoice_items for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = invoice_items.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = invoice_items.organization_id and m.user_id = auth.uid())
);
drop policy if exists "invoice_items delete by members" on public.invoice_items;
create policy "invoice_items delete by members" on public.invoice_items for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = invoice_items.organization_id and m.user_id = auth.uid())
);

-- payments
drop policy if exists "payments select by members" on public.payments;
create policy "payments select by members" on public.payments for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = payments.organization_id and m.user_id = auth.uid())
);
drop policy if exists "payments insert by members" on public.payments;
create policy "payments insert by members" on public.payments for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "payments update by members" on public.payments;
create policy "payments update by members" on public.payments for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = payments.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = payments.organization_id and m.user_id = auth.uid())
);
drop policy if exists "payments delete by members" on public.payments;
create policy "payments delete by members" on public.payments for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = payments.organization_id and m.user_id = auth.uid())
);

-- time_entries
drop policy if exists "time_entries select by members" on public.time_entries;
create policy "time_entries select by members" on public.time_entries for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = time_entries.organization_id and m.user_id = auth.uid())
);
drop policy if exists "time_entries insert by members" on public.time_entries;
create policy "time_entries insert by members" on public.time_entries for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "time_entries update by members" on public.time_entries;
create policy "time_entries update by members" on public.time_entries for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = time_entries.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = time_entries.organization_id and m.user_id = auth.uid())
);
drop policy if exists "time_entries delete by members" on public.time_entries;
create policy "time_entries delete by members" on public.time_entries for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = time_entries.organization_id and m.user_id = auth.uid())
);

-- notifications
drop policy if exists "notifications select by members" on public.notifications;
create policy "notifications select by members" on public.notifications for select to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = notifications.organization_id and m.user_id = auth.uid())
);
drop policy if exists "notifications insert by members" on public.notifications;
create policy "notifications insert by members" on public.notifications for insert to authenticated with check (
  exists(select 1 from public.organization_members m where m.organization_id = organization_id and m.user_id = auth.uid())
);
drop policy if exists "notifications update by members" on public.notifications;
create policy "notifications update by members" on public.notifications for update to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = notifications.organization_id and m.user_id = auth.uid())
) with check (
  exists(select 1 from public.organization_members m where m.organization_id = notifications.organization_id and m.user_id = auth.uid())
);
drop policy if exists "notifications delete by members" on public.notifications;
create policy "notifications delete by members" on public.notifications for delete to authenticated using (
  exists(select 1 from public.organization_members m where m.organization_id = notifications.organization_id and m.user_id = auth.uid())
);

