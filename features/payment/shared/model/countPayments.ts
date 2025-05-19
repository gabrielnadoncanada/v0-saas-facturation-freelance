import { createClient } from "@/shared/lib/supabase/server"

export async function countPayments() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("payments")
    .select("*", { count: "exact", head: true })
  if (error) throw error
  return count ?? 0
} 