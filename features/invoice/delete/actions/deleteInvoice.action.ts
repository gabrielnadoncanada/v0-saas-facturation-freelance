'use server'

import { deleteInvoice } from '@/features/invoice/delete/model/deleteInvoice'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function deleteInvoiceAction(invoiceId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteInvoice(invoiceId)
    return null
  }, { revalidatePath: '/dashboard/invoices', redirect: '/dashboard/invoices' })
}
