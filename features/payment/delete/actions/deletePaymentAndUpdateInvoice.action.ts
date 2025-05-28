'use server'

import { deletePayment } from '@/features/payment/delete/model/deletePayment'
import { revalidatePath } from 'next/cache'
import { fail, Result, success } from '@/shared/utils/result'

export async function deletePaymentAndUpdateInvoiceAction(paymentId: string): Promise<Result<null>> {
  try {
    await deletePayment(paymentId)
    revalidatePath('/dashboard/payments')
    revalidatePath('/dashboard/invoices')
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
