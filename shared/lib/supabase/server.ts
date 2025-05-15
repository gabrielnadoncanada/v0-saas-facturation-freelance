import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/shared/lib/database.types"

export const createClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
