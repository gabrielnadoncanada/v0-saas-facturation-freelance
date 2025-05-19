import { getSessionUser } from '@/shared/utils/getSessionUser'
import { InvoiceItem } from '@/features/invoice/shared/types/invoice.types'

export async function upsertInvoiceItems(invoiceId: string, items: InvoiceItem[], taxRate: number): Promise<null> {
  const { supabase } = await getSessionUser()

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const position = i + 1

    const basePayload = {
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      tax_rate: Number(taxRate),
      amount: Number(item.quantity) * Number(item.unit_price),
      position
    }

    if (item.isNew || !item.id) {
      const res = await supabase.from("invoice_items").insert({
        invoice_id: invoiceId,
        ...basePayload,
      })
      if (res.error) throw new Error(res.error.message)
    } else {
      const res = await supabase
        .from("invoice_items")
        .update(basePayload)
        .eq("id", item.id)
      if (res.error) throw new Error(res.error.message)
    }
  }

  return null
}
