'use server'

import { fetchAllPayments } from './fetchAllPayments'
import { PaymentActionResult } from '@/shared/types/payments/payment'

export async function getAllPaymentsAction(): Promise<PaymentActionResult> {
  try {
    const payments = await fetchAllPayments()
    return {
      success: true,
      data: { payments },
    }
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      data: { payments: [] },
    }
  }
}
