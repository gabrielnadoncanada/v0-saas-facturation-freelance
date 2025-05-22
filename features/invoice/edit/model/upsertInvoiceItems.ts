import { getSessionUser } from '@/shared/utils/getSessionUser'
import { InvoiceItem } from '@/features/invoice/shared/types/invoice.types'

export async function upsertInvoiceItems(invoiceId: string, items: InvoiceItem[], taxRate: number): Promise<null> {
  const { supabase } = await getSessionUser()

  if (items.length === 0) return null

  const payloads = items.map((item, index) => {
    const basePayload = {
      invoice_id: invoiceId,
      description: item.description,
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      tax_rate: Number(taxRate),
      amount: Number(item.quantity) * Number(item.unit_price),
      position: index + 1,
    }

    if (item.isNew || !item.id || item.id.startsWith('new-item-')) {
      return basePayload
    }

    return { id: item.id, ...basePayload }
  })

  const { error } = await supabase.from('invoice_items').upsert(payloads)

  if (error) {
    throw new Error(error.message || 'Erreur lors de la mise à jour des lignes de facture')
  }

  return null
}
