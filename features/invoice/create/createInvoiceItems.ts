import { InvoiceItem } from '@/types/invoices/invoice'
import { getSessionUser } from '@/shared/getSessionUser'

export async function createInvoiceItems(
  invoiceId: string,
  items: InvoiceItem[],
  globalTaxRate: number
): Promise<void> {
  const { supabase } = await getSessionUser()

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const position = i + 1

    const { error } = await supabase.from('invoice_items').insert({
      invoice_id: invoiceId,
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      tax_rate: Number(globalTaxRate),
      amount: Number(item.quantity) * Number(item.unit_price),
      position,
    })

    if (error) {
      throw new Error(error.message || `Erreur ligne #${position}`)
    }
  }
}
