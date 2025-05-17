'use server'

import { fetchAllInvoices } from '../model/fetchAllInvoices'
import { Invoice } from '@/shared/types/invoices/invoice'

export async function getAllInvoicesAction(): Promise<Invoice[]> {
  return fetchAllInvoices()
}
