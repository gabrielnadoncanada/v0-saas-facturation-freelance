import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      payments:payments(*),
      client:client_id(name,email)
    `)
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .single()


  if (error || !data) throw new Error('Facture non trouvée')

  return data as Invoice
}
