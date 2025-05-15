'use server'

import { revalidatePath } from 'next/cache'
import { updatePaymentInDb } from './updatePaymentInDb'
import { PaymentFormData, PaymentActionResult } from '@/shared/types/payments/payment'

export async function updatePaymentAction(
  paymentId: string,
  formData: PaymentFormData
): Promise<PaymentActionResult> {
  try {
    await updatePaymentInDb(paymentId, formData)
    revalidatePath("/dashboard/payments")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
