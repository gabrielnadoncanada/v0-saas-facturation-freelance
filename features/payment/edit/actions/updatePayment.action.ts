'use server'

import { revalidatePath } from 'next/cache'
import { PAYMENTS_PATH } from '@/shared/lib/routes'
import { updatePayment } from '@/features/payment/edit/model/updatePayment'
import { PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function updatePaymentAction(
  paymentId: string,
  formData: PaymentFormData
): Promise<Result<null>> {
  try {
    await updatePayment(paymentId, formData)
    revalidatePath(PAYMENTS_PATH)
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
