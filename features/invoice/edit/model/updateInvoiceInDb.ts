import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Invoice } from '@/shared/types/invoices/invoice'

export async function updateInvoiceInDb(invoiceId: string, formData: Invoice) {
  const { supabase, user } = await getSessionUser()
  
  const issueDate = typeof formData.issue_date === 'string' ? new Date(formData.issue_date) : formData.issue_date
  const dueDate = typeof formData.due_date === 'string' ? new Date(formData.due_date) : formData.due_date

  const { error } = await supabase
    .from("invoices")
    .update({
      client_id: formData.client_id,
      issue_date: issueDate.toISOString().split("T")[0],
      due_date: dueDate.toISOString().split("T")[0],
      status: formData.status,
      currency: formData.currency,
      language: formData.language,
      notes: formData.notes,
      tax_rate: formData.tax_rate,
    })
    .eq("id", invoiceId)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
}
