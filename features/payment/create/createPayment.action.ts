'use server'

import { revalidatePath } from 'next/cache'
import { PaymentFormData, PaymentActionResult } from '@/shared/types/payments/payment'
import { createPaymentInDb } from './createPaymentInDb'

export async function createPaymentAction(formData: PaymentFormData): Promise<PaymentActionResult> {
  try {
    await createPaymentInDb(formData)
    revalidatePath("/dashboard/payments")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
