import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()

  return await fetchById<Invoice>(
    supabase,
    'invoices',
    invoiceId,
    `
      *,
      payments:payments(*),
      client:client_id(name,email)
    `,
    { user_id: user.id }
  )
}
