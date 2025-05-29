'use server'

import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { getPayment } from '@/features/payment/shared/model/getPayment'
import { Payment } from '@/features/payment/shared/types/payment.types'

export async function getPaymentAction(paymentId: string): Promise<Result<Payment>> {
  return withAction(async () => {
    const payment = await getPayment(paymentId)
    return payment
  })
}
