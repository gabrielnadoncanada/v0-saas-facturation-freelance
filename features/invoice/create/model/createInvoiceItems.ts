import { InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function createInvoiceItems(
  invoiceId: string,
  items: InvoiceItem[],
  globalTaxRate: number
): Promise<void> {
  const { supabase } = await getSessionUser()

  if (items.length === 0) return

  const payloads = items.map((item, index) => ({
    invoice_id: invoiceId,
    description: item.description,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price),
    tax_rate: Number(globalTaxRate),
    amount: Number(item.quantity) * Number(item.unit_price),
    position: index + 1,
  }))

  const { error } = await supabase.from('invoice_items').insert(payloads)

  if (error) {
    throw new Error(error.message || 'Erreur lors de la création des lignes de facture')
  }
}
