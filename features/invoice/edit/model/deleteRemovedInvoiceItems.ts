import { InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { batchDelete } from '@/shared/services/supabase/crud'

export async function deleteRemovedInvoiceItems(items: InvoiceItem[], originalItems: InvoiceItem[]): Promise<void> {
  const { supabase } = await getSessionUser()

  const itemsToDelete = originalItems
    .filter(item => !items.some(newItem => newItem.id === item.id))
    .map(item => item.id)

  if (itemsToDelete.length > 0) {
    await batchDelete(supabase, 'invoice_items', itemsToDelete as string[])
  }
}
