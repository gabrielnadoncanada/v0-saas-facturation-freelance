import { InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  const { supabase } = await getSessionUser()

  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('position', { ascending: true })

  if (error) throw new Error(error.message)

  return data || []
}
