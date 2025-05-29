import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchList } from '@/shared/services/supabase/crud'

export async function getInvoices(): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser()

  return await fetchList<Invoice>(
    supabase,
    'invoices',
    '*, client:client_id(name)',
    { user_id: user.id },
    { column: 'created_at', ascending: false }
  )
}
