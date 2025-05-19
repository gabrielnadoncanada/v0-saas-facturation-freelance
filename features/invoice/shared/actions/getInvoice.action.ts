'use server'

import { getInvoice } from "@/features/invoice/view/model/getInvoice"
import { getInvoiceItems } from "@/features/invoice/view/model/getInvoiceItems"
import { getClientsList } from "@/features/invoice/view/model/getClients"
import { getDefaultCurrency } from "@/features/invoice/view/model/getDefaultCurrency"
import { Result } from "@/shared/utils/result"
import { InvoiceDetailsProps } from "@/features/invoice/shared/types/invoice.types"

export async function getInvoiceAction(invoiceId: string): Promise<Result<InvoiceDetailsProps>> {
  try {
    const invoice = await getInvoice(invoiceId)
    const invoiceItems = await getInvoiceItems(invoiceId)
    const clients = await getClientsList()
    const defaultCurrency = await getDefaultCurrency()

    return {
      success: true,
      data: { invoice, invoiceItems, clients, defaultCurrency }
    }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}
