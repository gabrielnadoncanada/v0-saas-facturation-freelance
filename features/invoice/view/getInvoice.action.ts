'use server'

import { fetchInvoiceById } from './fetchInvoiceById'
import { fetchInvoiceItems } from './fetchInvoiceItems'
import { fetchClientsList } from './fetchClientsList'
import { fetchDefaultCurrency } from './fetchDefaultCurrency'
import { InvoiceActionResult } from '@/shared/types/invoices/invoice'
import { fetchAllPayments } from '@/features/payment'

export async function getInvoiceAction(invoiceId: string): Promise<InvoiceActionResult> {
  try {
    const invoice = await fetchInvoiceById(invoiceId)
    const invoiceItems = await fetchInvoiceItems(invoiceId)
    const clients = await fetchClientsList()
    const defaultCurrency = await fetchDefaultCurrency()

    return {
      success: true,
      data: {
        invoice,
        invoiceItems,
        clients,
        defaultCurrency,
      }
    }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
