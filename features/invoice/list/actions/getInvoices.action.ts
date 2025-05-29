'use server'

import { getInvoices } from '../model/getInvoices'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function getInvoicesAction(): Promise<Result<Invoice[]>> {
  return withAction(async () => {
    const invoices = await getInvoices()
    return invoices
  })
}
