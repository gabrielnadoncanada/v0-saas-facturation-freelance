'use server'

import { deleteInvoiceItemsByInvoiceId } from '@/features/invoice/delete/model/deleteInvoiceItemsByInvoiceId'
import { deleteInvoiceById } from '@/features/invoice/delete/model/deleteInvoiceById'
import { InvoiceActionResult } from '@/shared/types/invoices/invoice'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteInvoiceAction(invoiceId: string): Promise<InvoiceActionResult> {
  try {
    await deleteInvoiceItemsByInvoiceId(invoiceId)
    await deleteInvoiceById(invoiceId)

    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Erreur inconnue' }
  }
}
