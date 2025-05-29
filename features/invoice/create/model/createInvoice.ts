import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function createInvoice(formData: Invoice): Promise<string> {
  const { supabase, user } = await getSessionUser()

  const issueDate = typeof formData.issue_date === 'string' ? new Date(formData.issue_date) : formData.issue_date
  const dueDate = typeof formData.due_date === 'string' ? new Date(formData.due_date) : formData.due_date

  // Retrieve current invoice counter for the user
  const { data: counter, error: counterError } = await supabase
    .from('invoice_counters')
    .select('id, last_number')
    .eq('user_id', user.id)
    .maybeSingle()

  if (counterError) {
    throw new Error(counterError.message)
  }

  const nextNumber = (counter?.last_number || 0) + 1
  const invoiceNumber = `INV-${new Date().getFullYear()}-${nextNumber.toString().padStart(3, '0')}`

  // Upsert the counter with the new value
  if (counter) {
    const { error: updateError } = await supabase
      .from('invoice_counters')
      .update({ last_number: nextNumber })
      .eq('id', counter.id)
    if (updateError) throw new Error(updateError.message)
  } else {
    const { error: insertError } = await supabase
      .from('invoice_counters')
      .insert({ user_id: user.id, last_number: nextNumber })
    if (insertError) throw new Error(insertError.message)
  }

  const { data, error } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id: formData.client.id,
      invoice_number: invoiceNumber,
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
