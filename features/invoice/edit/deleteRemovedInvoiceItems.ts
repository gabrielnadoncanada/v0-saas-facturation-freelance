import { InvoiceItem } from '@/shared/types/invoices/invoice'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function deleteRemovedInvoiceItems(items: InvoiceItem[], originalItems: InvoiceItem[]) {
  const { supabase } = await getSessionUser()

  const itemsToDelete = originalItems
    .filter(item => !items.some(newItem => newItem.id === item.id))
    .map(item => item.id)

  if (itemsToDelete.length > 0) {
    const { error } = await supabase
      .from("invoice_items")
      .delete()
      .in("id", itemsToDelete as string[])

    if (error) throw new Error(error.message)
  }
}
