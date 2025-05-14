import { getSessionUser } from '@/shared/getSessionUser'
import { InvoiceItem, Invoice } from '@/types/invoices/invoice'

export async function upsertInvoiceItems(invoiceId: string, items: InvoiceItem[], taxRate: number) {
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
      const { error } = await supabase.from("invoice_items").insert({
        invoice_id: invoiceId,
        ...basePayload,
      })
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from("invoice_items")
        .update(basePayload)
        .eq("id", item.id)
      if (error) throw new Error(error.message)
    }
  }
}
