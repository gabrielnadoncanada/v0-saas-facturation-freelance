-- Session-scoped context (optional utility used by app)
create or replace function public.set_current_organization(org_id uuid)
returns void
language plpgsql
as $$
begin
  perform set_config('app.current_organization', org_id::text, true);
end;
$$;

-- Sum payments for an invoice
create or replace function public.sum_payments_by_invoice(invoiceId uuid)
returns numeric
language sql
stable
as $$
  select coalesce(sum(amount), 0)::numeric from public.payments where invoice_id = invoiceId;
$$;

-- Organization stats (rich)
create or replace function public.get_organization_stats(organization_id_param uuid)
returns table (
  total_clients int,
  total_invoices int,
  total_projects int,
  total_products int,
  total_payments int,
  total_invoiced numeric,
  total_paid numeric,
  total_outstanding numeric,
  total_overdue numeric,
  time_tracked_hours numeric,
  project_count int,
  completed_tasks_count int
)
language plpgsql
stable
as $$
begin
  return query
  select
    (select count(*) from public.clients c where c.organization_id = organization_id_param) as total_clients,
    (select count(*) from public.invoices i where i.organization_id = organization_id_param) as total_invoices,
    (select count(*) from public.projects p where p.organization_id = organization_id_param) as total_projects,
    (select count(*) from public.products pr where pr.organization_id = organization_id_param) as total_products,
    (select count(*) from public.payments py where py.organization_id = organization_id_param) as total_payments,
    (select coalesce(sum(i.total),0)::numeric from public.invoices i where i.organization_id = organization_id_param) as total_invoiced,
    (select coalesce(sum(py.amount),0)::numeric from public.payments py where py.organization_id = organization_id_param) as total_paid,
    (
      (select coalesce(sum(i.total),0)::numeric from public.invoices i where i.organization_id = organization_id_param)
      -
      (select coalesce(sum(py.amount),0)::numeric from public.payments py
         join public.invoices ii on ii.id = py.invoice_id
        where ii.organization_id = organization_id_param)
    ) as total_outstanding,
    (select coalesce(sum(i.total),0)::numeric from public.invoices i where i.organization_id = organization_id_param and i.status <> 'paid' and i.due_date < current_date) as total_overdue,
    (select coalesce(sum(extract(epoch from (coalesce(te.end_time, now()) - te.start_time)))/3600,0)::numeric from public.time_entries te where te.organization_id = organization_id_param) as time_tracked_hours,
    (select count(*) from public.projects p2 where p2.organization_id = organization_id_param) as project_count,
    (select count(*) from public.tasks t where t.organization_id = organization_id_param and t.status = 'completed') as completed_tasks_count;
end;
$$;

-- User stats over all organizations the user belongs to
create or replace function public.get_user_stats(user_id_param uuid)
returns table (
  total_invoiced numeric,
  total_paid numeric,
  total_outstanding numeric,
  total_overdue numeric,
  client_count int,
  invoice_count int,
  time_tracked_hours numeric,
  project_count int,
  completed_tasks_count int
)
language plpgsql
stable
as $$
begin
  return query
  with user_orgs as (
    select om.organization_id
    from public.organization_members om
    where om.user_id = user_id_param
  )
  select
    (select coalesce(sum(i.total),0)::numeric from public.invoices i where i.organization_id in (select organization_id from user_orgs)) as total_invoiced,
    (select coalesce(sum(py.amount),0)::numeric from public.payments py join public.invoices ii on ii.id = py.invoice_id where ii.organization_id in (select organization_id from user_orgs)) as total_paid,
    (
      (select coalesce(sum(i.total),0)::numeric from public.invoices i where i.organization_id in (select organization_id from user_orgs))
      -
      (select coalesce(sum(py.amount),0)::numeric from public.payments py join public.invoices ii on ii.id = py.invoice_id where ii.organization_id in (select organization_id from user_orgs))
    ) as total_outstanding,
    (select coalesce(sum(i.total),0)::numeric from public.invoices i where i.organization_id in (select organization_id from user_orgs) and i.status <> 'paid' and i.due_date < current_date) as total_overdue,
    (select count(*) from public.clients c where c.organization_id in (select organization_id from user_orgs)) as client_count,
    (select count(*) from public.invoices i where i.organization_id in (select organization_id from user_orgs)) as invoice_count,
    (select coalesce(sum(extract(epoch from (coalesce(te.end_time, now()) - te.start_time)))/3600,0)::numeric from public.time_entries te where te.organization_id in (select organization_id from user_orgs)) as time_tracked_hours,
    (select count(*) from public.projects p where p.organization_id in (select organization_id from user_orgs)) as project_count,
    (select count(*) from public.tasks t where t.organization_id in (select organization_id from user_orgs) and t.status = 'completed') as completed_tasks_count;
end;
$$;

-- Utility: mark overdue invoices
create or replace function public.check_overdue_invoices()
returns void
language sql
as $$
  update public.invoices
     set status = 'overdue'
   where status <> 'paid'
     and due_date < current_date;
$$;

