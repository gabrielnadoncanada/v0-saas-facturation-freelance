import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/shared/lib/database.types"

export const createClient = () => {
  return createClientComponentClient<Database>()
}
