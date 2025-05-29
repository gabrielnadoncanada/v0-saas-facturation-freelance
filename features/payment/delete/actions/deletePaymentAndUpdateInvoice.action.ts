'use server'

import { deletePayment } from '@/features/payment/delete/model/deletePayment'
import { revalidatePath } from 'next/cache'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function deletePaymentAndUpdateInvoiceAction(paymentId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deletePayment(paymentId)
    revalidatePath('/dashboard/payments')
    revalidatePath('/dashboard/invoices')
    return null
  })
}
