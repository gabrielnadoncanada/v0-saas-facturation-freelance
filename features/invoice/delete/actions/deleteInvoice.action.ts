'use server'

import { deleteInvoice } from '@/features/invoice/delete/model/deleteInvoice'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { INVOICES_PATH } from '@/shared/lib/routes'
import { fail, Result } from '@/shared/utils/result'

export async function deleteInvoiceAction(invoiceId: string): Promise<Result<Invoice>> {
  try {
    await deleteInvoice(invoiceId)
    revalidatePath(INVOICES_PATH)
    redirect(INVOICES_PATH)
  } catch (err: any) {
    return fail((err as Error).message)
  }
}
