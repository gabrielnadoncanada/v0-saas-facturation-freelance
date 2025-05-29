'use server'

import { createInvoice } from '@/features/invoice/create/model/createInvoice'
import { createInvoiceItems } from '@/features/invoice/create/model/createInvoiceItems'
import { Invoice, InvoiceItem } from '@/features/invoice/shared/types/invoice.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function createInvoiceAction(formData: Invoice, items: InvoiceItem[]): Promise<Result<null>> {
  return withAction(async () => {
    const invoiceId = await createInvoice(formData)
    await createInvoiceItems(invoiceId, items, formData.tax_rate)
    return null
  }, { revalidatePath: '/dashboard/invoices' })
}
