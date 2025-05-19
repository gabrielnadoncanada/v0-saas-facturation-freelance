'use server'

import { getInvoices } from '../model/getInvoices'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { fail, Result, success } from '@/shared/utils/result'

export async function getInvoicesAction(): Promise<Result<Invoice[]>> {
  try {
    const invoices = await getInvoices()
    return success(invoices)
  } catch (error) {
    return fail((error as Error).message)
  }
}
