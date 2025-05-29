'use server'

import { revalidatePath } from 'next/cache'
import { updateInvoiceStatus } from '@/features/invoice/shared/model/updateInvoiceStatus'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'

export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: string
): Promise<Result<Invoice>> {
  return withAction(async () => {
    const invoice = await updateInvoiceStatus(invoiceId, status)
    return invoice
  }, { revalidatePath: '/dashboard/invoices' })
}
