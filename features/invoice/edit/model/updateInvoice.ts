import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { updateRecord } from '@/shared/services/supabase/crud'

export async function updateInvoice(invoiceId: string, formData: Invoice): Promise<Invoice> {
  const { supabase, user } = await getSessionUser()
  
  const issueDate = typeof formData.issue_date === 'string' ? new Date(formData.issue_date) : formData.issue_date
  const dueDate = typeof formData.due_date === 'string' ? new Date(formData.due_date) : formData.due_date

  const updateData = {
    client_id: formData.client.id,
    issue_date: issueDate.toISOString().split("T")[0],
    due_date: dueDate.toISOString().split("T")[0],
    status: formData.status,
    currency: formData.currency,
    language: formData.language,
    notes: formData.notes,
    tax_rate: formData.tax_rate,
  }

  return await updateRecord<Invoice>(
    supabase,
    'invoices',
    invoiceId,
    updateData,
    '*',
    { user_id: user.id }
  )
}
