import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function fetchUpcomingTasks() {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("tasks")
    .select("*, projects(name)")
    .in("status", ["pending", "in_progress"])
    .eq("projects.user_id", user.id)
    .order("due_date", { ascending: true })
    .limit(5)

  if (error) throw new Error(error.message)
  return data || []
}
