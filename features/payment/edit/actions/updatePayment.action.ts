'use server'

import { revalidatePath } from 'next/cache'
import { updatePayment } from '@/features/payment/edit/model/updatePayment'
import { PaymentFormData } from '@/features/payment/shared/types/payment.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function updatePaymentAction(
  paymentId: string,
  formData: PaymentFormData
): Promise<Result<null>> {
  return withAction(async () => {
    await updatePayment(paymentId, formData)
    return null
  }, { revalidatePath: '/dashboard/payments' })
}
