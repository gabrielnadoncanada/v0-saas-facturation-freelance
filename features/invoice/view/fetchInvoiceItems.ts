import { InvoiceItem } from '@/shared/types/invoices/invoice'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function fetchInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  const { supabase } = await getSessionUser()

  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('position', { ascending: true })

  if (error) throw new Error(error.message)

  return data || []
}
