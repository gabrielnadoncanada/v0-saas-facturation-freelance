import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function createInvoice(formData: Invoice): Promise<string> {
  const { supabase, user } = await getSessionUser()

  const issueDate = typeof formData.issue_date === 'string' ? new Date(formData.issue_date) : formData.issue_date
  const dueDate = typeof formData.due_date === 'string' ? new Date(formData.due_date) : formData.due_date

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id: formData.client_id,
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
    })
    .select()

  if (error || !data?.[0]?.id) {
    throw new Error(error?.message || 'Erreur lors de la création de la facture')
  }

  return data[0].id
}
