'use server'

import { fetchAllInvoices } from './fetchAllInvoices'
import { Invoice } from '@/types/invoices/invoice'

export async function getAllInvoicesAction(): Promise<Invoice[]> {
  return fetchAllInvoices()
}
