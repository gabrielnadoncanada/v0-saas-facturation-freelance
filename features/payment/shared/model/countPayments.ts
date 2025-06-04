import { createClient } from '@/shared/lib/supabase/server';
import { countRecords } from '@/shared/services/supabase/crud';

export async function countPayments(): Promise<number> {
  const supabase = await createClient();

  // Get active organization from cookies
  const cookieStore = await import('next/headers').then((mod) => mod.cookies());
  const activeOrgId = cookieStore.get('active_organization_id')?.value;

  if (!activeOrgId) {
    return 0;
  }

  // Payments are linked to invoices which are linked to organizations
  // We need to use a custom query instead of the simple countRecords function
  const { count, error } = await supabase
    .from('payments')
    .select('*', { count: 'exact', head: true })
    .eq('invoices.organization_id', activeOrgId);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
