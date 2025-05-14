'use server'

import { createInvoiceInDb } from '@/features/invoice/create/createInvoiceInDb'
import { createInvoiceItems } from '@/features/invoice/create/createInvoiceItems'
import { Invoice, InvoiceActionResult, InvoiceItem } from '@/features/invoice/shared/invoice.types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInvoiceAction(
  formData: Invoice,
  items: InvoiceItem[]
): Promise<InvoiceActionResult> {
  const invoiceId = await createInvoiceInDb(formData)
  await createInvoiceItems(invoiceId, items, formData.tax_rate)

  revalidatePath('/dashboard/invoices')
  redirect(`/dashboard/invoices/${invoiceId}`)
}
