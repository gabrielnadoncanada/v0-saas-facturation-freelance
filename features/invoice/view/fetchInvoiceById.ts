import { Invoice } from '@/types/invoices/invoice'
import { getSessionUser } from '@/shared/getSessionUser'

export async function fetchInvoiceById(invoiceId: string): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) throw new Error('Facture non trouvée')

  return data as Invoice
}
