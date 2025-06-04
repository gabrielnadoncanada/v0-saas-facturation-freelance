import { getSessionUser } from '@/shared/utils/getSessionUser'

export interface UserStats {
  total_invoiced: number
  total_paid: number
  total_outstanding: number
  total_overdue: number
  client_count: number
  invoice_count: number
  time_tracked_hours: number
  project_count: number
  completed_tasks_count: number
}

export async function getOrganizationStats(): Promise<UserStats | null> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return null
  }

  const { data, error } = await supabase.rpc("get_organization_stats", {
    organization_id_param: organization.id,
  })

  if (error) throw new Error(error.message)
  
  return data?.[0] || null
} 