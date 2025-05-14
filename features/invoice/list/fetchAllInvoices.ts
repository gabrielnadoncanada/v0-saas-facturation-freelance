import { Invoice } from '@/types/invoices/invoice'
import { getSessionUser } from '@/shared/getSessionUser'
import { extractDataOrThrow } from '@/shared/extractDataOrThrow'

export async function fetchAllInvoices(): Promise<Invoice[]> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from('invoices')
    .select('*, clients(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return extractDataOrThrow<Invoice[]>(res)
}
