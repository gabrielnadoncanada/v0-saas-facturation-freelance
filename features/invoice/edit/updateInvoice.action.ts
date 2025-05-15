"use server"
import { Invoice, InvoiceActionResult, InvoiceItem } from '@/shared/types/invoices/invoice'
import { updateInvoiceInDb } from '@/features/invoice/edit/updateInvoiceInDb'
import { deleteRemovedInvoiceItems } from '@/features/invoice/edit/deleteRemovedInvoiceItems'
import { upsertInvoiceItems } from '@/features/invoice/edit/upsertInvoiceItems'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateInvoiceAction(
  invoiceId: string,
  formData: Invoice,
  items: InvoiceItem[],
  originalItems: InvoiceItem[] = []
): Promise<InvoiceActionResult> {
  try {
    await updateInvoiceInDb(invoiceId, formData)
    await deleteRemovedInvoiceItems(items, originalItems)
    await upsertInvoiceItems(invoiceId, items, formData.tax_rate)

    revalidatePath("/dashboard/invoices")
    redirect(`/dashboard/invoices/${invoiceId}`)
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
