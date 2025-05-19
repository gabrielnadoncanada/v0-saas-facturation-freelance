'use server'

import { createInvoice } from '@/features/invoice/create/model/createInvoice'
import { createInvoiceItems } from '@/features/invoice/create/model/createInvoiceItems'
import { Invoice, InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { fail, Result, success } from '@/shared/utils/result'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInvoiceAction(
  formData: Invoice,
  items: InvoiceItem[]
): Promise<Result<Invoice>> {
  try {
    const invoiceId = await createInvoice(formData)
    await createInvoiceItems(invoiceId, items, formData.tax_rate)
    revalidatePath('/dashboard/invoices')
    redirect(`/dashboard/invoices/${invoiceId}`)
  } catch (error) {
    return fail((error as Error).message)
  }
}
