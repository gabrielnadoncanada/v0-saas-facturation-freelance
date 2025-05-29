"use server"
import { Invoice, InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { updateInvoice } from '@/features/invoice/edit/model/updateInvoice'
import { deleteRemovedInvoiceItems } from '@/features/invoice/edit/model/deleteRemovedInvoiceItems'
import { upsertInvoiceItems } from '@/features/invoice/edit/model/upsertInvoiceItems'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function updateInvoiceAction(
  invoiceId: string,
  formData: Invoice,
  items: InvoiceItem[],
  originalItems: InvoiceItem[] = []
): Promise<Result<null>> {
  return withAction(async () => {
    await updateInvoice(invoiceId, formData)
    await deleteRemovedInvoiceItems(items, originalItems)
    await upsertInvoiceItems(invoiceId, items, formData.tax_rate)
    return null
  }, { revalidatePath: '/dashboard/invoices', redirect: `/dashboard/invoices/${invoiceId}` })
}
