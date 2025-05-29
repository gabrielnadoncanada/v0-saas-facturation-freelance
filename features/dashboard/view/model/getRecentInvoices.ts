import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getRecentInvoices(): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Invoice>(
    supabase,
    'invoices',
    '*, client:clients(name)',
    { user_id: user.id },
    { column: 'created_at', ascending: false },
    5 // limit to 5 invoices
  )
}
