import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { insertRecord } from '@/shared/services/supabase/crud'

export async function createInvoice(formData: Invoice): Promise<string> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const issueDate = typeof formData.issue_date === 'string' ? new Date(formData.issue_date) : formData.issue_date
  const dueDate = typeof formData.due_date === 'string' ? new Date(formData.due_date) : formData.due_date

  const invoiceData = {
    organization_id: organization.id,
    client_id: formData.client.id,
    issue_date: issueDate.toISOString().split('T')[0],
    due_date: dueDate.toISOString().split('T')[0],
    status: formData.status,
    currency: formData.currency,
    language: formData.language,
    notes: formData.notes,
    tax_rate: formData.tax_rate,
    subtotal: 0,
    tax_total: 0,
    total: 0,
  }

  const result = await insertRecord<Invoice>(
    supabase,
    'invoices',
    invoiceData
  )

  return result.id
}
