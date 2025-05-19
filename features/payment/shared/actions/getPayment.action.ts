'use server'

import { success, fail, Result } from '@/shared/utils/result'
import { getPayment } from '@/features/payment/shared/model/getPayment'
import { Payment } from '@/features/payment/shared/types/payment.types'

export async function getPaymentAction(paymentId: string): Promise<Result<Payment>> {
  try {
    const payment = await getPayment(paymentId)
    return success(payment)
  } catch (error) {
    return fail((error as Error).message)
  }
}
