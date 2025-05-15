import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function fetchRecentProjects() {
  const { supabase, user } = await getSessionUser()

  const { data, error } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  if (error) throw new Error(error.message)
  return data || []
}
