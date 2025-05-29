import { createClient } from "@/shared/lib/supabase/server"
import { countRecords } from "@/shared/services/supabase/crud"

export async function countPayments(): Promise<number> {
  const supabase = await createClient()
  return await countRecords(supabase, "payments")
} 