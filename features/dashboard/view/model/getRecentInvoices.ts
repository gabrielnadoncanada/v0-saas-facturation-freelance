import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getRecentInvoices(): Promise<Invoice[]> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  return await fetchList<Invoice>(
    supabase,
    'invoices',
    '*, client:clients(name)',
    { organization_id: organization.id },
    { column: 'created_at', ascending: false },
    5 // limit to 5 invoices
  )
}
