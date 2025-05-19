import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'

export async function updateInvoiceStatus(invoiceId: string, status: string): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  return extractDataOrThrow<Invoice>(res)
}
