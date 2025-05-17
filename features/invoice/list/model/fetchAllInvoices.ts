import { Invoice } from '@/shared/types/invoices/invoice'
import { getSessionUser } from '@/shared/utils/getSessionUser'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function fetchAllInvoices(): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('invoices')
    .select('*, client:client_id(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return extractDataOrThrow<Invoice[]>(res)
}
