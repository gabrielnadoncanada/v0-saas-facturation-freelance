'use server'

import { deletePaymentInDb } from './deletePaymentInDb'
import { PaymentActionResult } from '@/shared/types/payments/payment'
import { revalidatePath } from 'next/cache'

export async function deletePaymentAction(paymentId: string): Promise<PaymentActionResult> {
  try {
    await deletePaymentInDb(paymentId)
    revalidatePath("/dashboard/payments")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
