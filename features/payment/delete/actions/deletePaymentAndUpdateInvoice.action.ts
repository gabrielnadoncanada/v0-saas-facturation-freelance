'use server'

import { deletePayment } from '@/features/payment/delete/model/deletePayment'
import { revalidatePath } from 'next/cache'
import { PAYMENTS_PATH, INVOICES_PATH } from '@/shared/lib/routes'
import { fail, Result, success } from '@/shared/utils/result'

export async function deletePaymentAndUpdateInvoiceAction(paymentId: string): Promise<Result<null>> {
  try {
    await deletePayment(paymentId)
    revalidatePath(PAYMENTS_PATH)
    revalidatePath(INVOICES_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
