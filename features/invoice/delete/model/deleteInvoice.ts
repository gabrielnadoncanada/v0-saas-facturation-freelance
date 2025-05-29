import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { deleteRecord } from '@/shared/services/supabase/crud'

export async function deleteInvoice(invoiceId: string): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()

  return await deleteRecord<Invoice>(
    supabase,
    'invoices',
    invoiceId,
    '*',
    { user_id: user.id }
  )
}
