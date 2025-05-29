import { Invoice } from '@/features/invoice/shared/types/invoice.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getRecentInvoices() {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("invoices")
    .select("*, client:clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return extractDataOrThrow<Invoice[]>(res)
}
