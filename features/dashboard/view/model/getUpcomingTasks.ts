import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Task } from '@/features/task/shared/types/task.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getUpcomingTasks() {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("tasks")
    .select("*, projects(name)")
    .in("status", ["pending", "in_progress"])
    .eq("projects.user_id", user.id)
    .order("due_date", { ascending: true })
    .limit(5)

  return extractDataOrThrow<Task[]>(res)
}
