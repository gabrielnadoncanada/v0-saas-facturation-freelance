'use server'

import { fetchPaymentById } from './fetchPaymentById'
import { fetchPaymentInvoices } from './fetchPaymentInvoices'
import { PaymentActionResult } from '@/shared/types/payments/payment'

export async function getPaymentAction(paymentId: string): Promise<PaymentActionResult> {
  try {
    const payment = await fetchPaymentById(paymentId)
    const invoices = await fetchPaymentInvoices(payment.invoice_id)

    return { success: true, data: { payment, invoices } }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
