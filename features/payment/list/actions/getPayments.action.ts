'use server'

import { fail, success, Result } from '@/shared/utils/result'
import { getPayments } from '../model/getPayments'
import { Payment } from '@/features/payment/shared/types/payment.types'

export async function getPaymentsAction(): Promise<Result<Payment[]>> {
  try {
    const payments = await getPayments()
    return success(payments)
  } catch (error) {
    return fail((error as Error).message)
  }
}
