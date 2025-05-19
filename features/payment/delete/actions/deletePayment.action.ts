'use server'

import { deletePayment } from '@/features/payment/delete/model/deletePayment'
import { fail } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'
import { Result } from '@/shared/utils/result'
import { revalidatePath } from 'next/cache'

export async function deletePaymentAction(paymentId: string): Promise<Result<null>> {
  try {
    await deletePayment(paymentId)
    revalidatePath("/dashboard/payments")
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
