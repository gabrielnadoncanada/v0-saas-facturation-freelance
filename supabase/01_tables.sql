-- Extensions needed for UUID generation
create extension if not exists pgcrypto;

-- Helper: update updated_at automatically
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Helper: ensure updated_at trigger exists on a table
create or replace function public.add_updated_at_trigger(p_table regclass)
returns void
language plpgsql
as $$
begin
  execute format('create trigger set_updated_at before update on %s for each row execute procedure public.set_updated_at()', p_table);
exception when duplicate_object then
  null;
end;
$$;

-- organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free',
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.add_updated_at_trigger('public.organizations');
create index if not exists organizations_slug_idx on public.organizations(slug);

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company_name text,
  logo_url text,
  default_currency text,
  default_hourly_rate numeric(10,2),
  organization_id uuid null references public.organizations(id) on delete set null,
  address text,
  city text,
  postal_code text,
  country text,
  phone text,
  tax_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.add_updated_at_trigger('public.profiles');
create unique index if not exists profiles_email_unique on public.profiles(lower(email));

-- organization_members
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
select public.add_updated_at_trigger('public.organization_members');
create index if not exists organization_members_org_idx on public.organization_members(organization_id);
create index if not exists organization_members_user_idx on public.organization_members(user_id);

-- organization_invitations
create table if not exists public.organization_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.add_updated_at_trigger('public.organization_invitations');
create index if not exists organization_invitations_org_idx on public.organization_invitations(organization_id);

-- organization_settings
create table if not exists public.organization_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  default_currency text not null default 'EUR',
  default_tax_rate numeric(5,2) not null default 0,
  invoice_prefix text not null default 'INV',
  invoice_number_format text not null default '{prefix}-{number}',
  next_invoice_number integer not null default 1,
  default_payment_terms integer not null default 30,
  late_fee_percentage numeric(5,2) not null default 0,
  company_address text,
  company_city text,
  company_postal_code text,
  company_country text,
  company_phone text,
  company_email text,
  company_website text,
  company_tax_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
select public.add_updated_at_trigger('public.organization_settings');

-- clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  hourly_rate numeric(10,2),
  billing_address text,
  billing_city text,
  billing_postal_code text,
  billing_country text,
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  shipping_country text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.clients');
create index if not exists clients_org_idx on public.clients(organization_id);

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  name text not null,
  description text,
  budget numeric(12,2),
  start_date date,
  end_date date,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.projects');
create index if not exists projects_org_idx on public.projects(organization_id);
create index if not exists projects_client_idx on public.projects(client_id);

-- tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_task_id uuid null references public.tasks(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'pending',
  priority text,
  assigned_to uuid null references auth.users(id) on delete set null,
  due_date date,
  estimated_hours numeric(6,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.tasks');
create index if not exists tasks_org_idx on public.tasks(organization_id);
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists tasks_parent_idx on public.tasks(parent_task_id);

-- product_categories
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.product_categories');
create index if not exists product_categories_org_idx on public.product_categories(organization_id);

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid null references public.product_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(12,2) not null,
  tax_rate numeric(5,2),
  is_service boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.products');
create index if not exists products_org_idx on public.products(organization_id);
create index if not exists products_category_idx on public.products(category_id);

-- invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  invoice_number text not null,
  issue_date date not null default now(),
  due_date date not null,
  currency text not null default 'EUR',
  language text not null default 'fr',
  notes text,
  status text not null default 'sent',
  subtotal numeric(12,2) not null default 0,
  tax_rate numeric(5,2),
  tax_total numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (organization_id, invoice_number)
);
select public.add_updated_at_trigger('public.invoices');
create index if not exists invoices_org_idx on public.invoices(organization_id);
create index if not exists invoices_client_idx on public.invoices(client_id);
create index if not exists invoices_status_idx on public.invoices(status);

-- time_entries
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid null references public.tasks(id) on delete set null,
  invoice_id uuid null references public.invoices(id) on delete set null,
  description text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  hourly_rate numeric(12,2) not null,
  billable boolean not null default true,
  billed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.time_entries');
create index if not exists time_entries_org_idx on public.time_entries(organization_id);
create index if not exists time_entries_user_idx on public.time_entries(user_id);


-- invoice_items
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 0,
  amount numeric(12,2) not null default 0,
  time_entry_id uuid null references public.time_entries(id) on delete set null,
  position integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.invoice_items');
create index if not exists invoice_items_invoice_idx on public.invoice_items(invoice_id);

-- payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_date date not null,
  payment_method text not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.payments');
create index if not exists payments_invoice_idx on public.payments(invoice_id);


-- notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  data jsonb,
  read boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
select public.add_updated_at_trigger('public.notifications');
create index if not exists notifications_org_idx on public.notifications(organization_id);
create index if not exists notifications_user_idx on public.notifications(user_id);

-- Trigger to auto add owner as member when an org is created
create or replace function public.add_owner_as_member()
returns trigger
language plpgsql
as $$
begin
  insert into public.organization_members(organization_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (organization_id, user_id) do nothing;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'organizations_add_owner_member'
  ) then
    create trigger organizations_add_owner_member
    after insert on public.organizations
    for each row execute procedure public.add_owner_as_member();
  end if;
end $$;

