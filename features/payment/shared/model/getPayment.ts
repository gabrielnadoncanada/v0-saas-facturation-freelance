import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Payment } from '@/features/payment/shared/types/payment.types'
import { fetchOne } from '@/shared/services/supabase/crud'

export async function getPayment(id: string): Promise<Payment> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const payment = await fetchOne<Payment>(
    supabase, 
    'payments', 
    id, 
    '*, invoice:invoices(id, invoice_number, client_id, client:clients(id, name))',
    { organization_id: organization.id }
  )

  if (!payment) {
    throw new Error("Paiement non trouvé")
  }

  return payment
}
