import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getInvoices(): Promise<Invoice[]> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  return await fetchList<Invoice>(
    supabase,
    'invoices',
    '*, client:client_id(name)',
    { organization_id: organization.id },
    { column: 'created_at', ascending: false }
  )
}
