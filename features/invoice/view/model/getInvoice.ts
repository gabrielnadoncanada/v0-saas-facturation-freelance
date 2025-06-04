import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  return await fetchById<Invoice>(
    supabase,
    'invoices',
    invoiceId,
    `
      *,
      payments:payments(*),
      client:client_id(name,email)
    `,
    { organization_id: organization.id }
  )
}
