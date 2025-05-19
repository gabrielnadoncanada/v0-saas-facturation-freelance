'use server'

import { revalidatePath } from 'next/cache'
import { PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { createPayment } from '@/features/payment/create/model/createPayment'
import { fail, Result, success } from '@/shared/utils/result'

export async function createPaymentAction(formData: PaymentFormData): Promise<Result<null>> {
  try {
    await createPayment(formData)
    revalidatePath("/dashboard/payments")
    return success(null)
  } catch (error) {
    return fail((error as Error).message)
  }
}
