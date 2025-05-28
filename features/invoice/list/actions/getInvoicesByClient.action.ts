"use server"

import { getInvoicesByClient } from '../model/getInvoicesByClient'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getInvoicesByClientAction(clientId: string): Promise<Result<Invoice[]>> {
  try {
    const invoices = await getInvoicesByClient(clientId)
    return success(invoices)
  } catch (error) {
    return fail((error as Error).message)
  }
}
