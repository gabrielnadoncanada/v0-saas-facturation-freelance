import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Task } from '@/features/task/shared/types/task.types'

export async function getUpcomingTasks(): Promise<Task[]> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    return []
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*, projects(name)")
    .in("status", ["pending", "in_progress"])
    .eq("projects.organization_id", organization.id)
    .order("due_date", { ascending: true })
    .limit(5)

  if (error) throw new Error(error.message)
  return data as Task[]
}
