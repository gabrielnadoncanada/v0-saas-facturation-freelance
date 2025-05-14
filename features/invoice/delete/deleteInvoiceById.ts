import { getSessionUser } from '@/shared/getSessionUser'

export async function deleteInvoiceById(invoiceId: string): Promise<void> {
  const { supabase, user } = await getSessionUser()

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }
}
