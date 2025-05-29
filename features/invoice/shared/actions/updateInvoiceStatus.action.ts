'use server'

import { revalidatePath } from 'next/cache'
import { INVOICES_PATH } from '@/shared/lib/routes'
import { updateInvoiceStatus } from '@/features/invoice/shared/model/updateInvoiceStatus'
import { fail, Result, success } from '@/shared/utils/result'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'

export async function updateInvoiceStatusAction(
  invoiceId: string,
  status: string
): Promise<Result<Invoice>> {
  try {
    const invoice = await updateInvoiceStatus(invoiceId, status)
    revalidatePath(INVOICES_PATH)
    return success(invoice)
  } catch (error) {
    return fail((error as Error).message)
  }
}
