import { createClient } from "@/shared/lib/supabase/server"

export async function countProducts() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
  if (error) throw error
  return count ?? 0
} 