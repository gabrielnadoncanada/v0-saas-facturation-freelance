import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'

export async function deleteInvoice(invoiceId: string): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .select()
    .single()

  return extractDataOrThrow<Invoice>(res)
}
