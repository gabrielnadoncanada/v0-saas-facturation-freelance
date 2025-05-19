import { createClient } from "@/shared/lib/supabase/server"

export async function countInvoices() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
  if (error) throw error
  return count ?? 0
} 