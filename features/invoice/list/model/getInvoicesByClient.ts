import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getInvoicesByClient(clientId: string): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('invoices')
    .select('*, client:client_id(name)')
    .eq('user_id', user.id)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  return extractDataOrThrow<Invoice[]>(res)
}
