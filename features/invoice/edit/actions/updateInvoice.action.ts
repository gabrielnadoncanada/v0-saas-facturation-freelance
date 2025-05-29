"use server"
import { Invoice, InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { updateInvoice } from '@/features/invoice/edit/model/updateInvoice'
import { deleteRemovedInvoiceItems } from '@/features/invoice/edit/model/deleteRemovedInvoiceItems'
import { upsertInvoiceItems } from '@/features/invoice/edit/model/upsertInvoiceItems'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { INVOICES_PATH, invoicePath } from '@/shared/lib/routes'
import { fail, Result } from '@/shared/utils/result'

export async function updateInvoiceAction(
  invoiceId: string,
  formData: Invoice,
  items: InvoiceItem[],
  originalItems: InvoiceItem[] = []
): Promise<Result<null>> {
  try {
    await updateInvoice(invoiceId, formData)
    await deleteRemovedInvoiceItems(items, originalItems)
    await upsertInvoiceItems(invoiceId, items, formData.tax_rate)
    revalidatePath(INVOICES_PATH)
    redirect(invoicePath(invoiceId))
  } catch (error) {
    return fail((error as Error).message)
  }
}
