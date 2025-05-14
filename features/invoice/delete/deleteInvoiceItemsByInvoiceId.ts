import { getSessionUser } from '@/shared/getSessionUser'

export async function deleteInvoiceItemsByInvoiceId(invoiceId: string): Promise<void> {
  const { supabase } = await getSessionUser()

  const { error } = await supabase
    .from('invoice_items')
    .delete()
    .eq('invoice_id', invoiceId)

  if (error) {
    throw new Error(error.message)
  }
}
