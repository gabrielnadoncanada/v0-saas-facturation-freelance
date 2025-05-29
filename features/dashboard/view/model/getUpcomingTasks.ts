import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Task } from '@/features/task/shared/types/task.types'

export async function getUpcomingTasks(): Promise<Task[]> {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("tasks")
    .select("*, projects(name)")
    .in("status", ["pending", "in_progress"])
    .eq("projects.user_id", user.id)
    .order("due_date", { ascending: true })
    .limit(5)

  if (error) throw new Error(error.message)
  return data as Task[]
}
