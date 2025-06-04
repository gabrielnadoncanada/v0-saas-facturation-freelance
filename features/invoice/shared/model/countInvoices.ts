import { createClient } from "@/shared/lib/supabase/server"
import { countRecords } from "@/shared/services/supabase/crud"

export async function countInvoices(): Promise<number> {
  const supabase = await createClient()
  
  // Get active organization from cookies
  const cookieStore = await import('next/headers').then(mod => mod.cookies())
  const activeOrgId = cookieStore.get('active_organization_id')?.value
  
  if (!activeOrgId) {
    return 0
  }
  
  return await countRecords(supabase, "invoices", { organization_id: activeOrgId })
} 