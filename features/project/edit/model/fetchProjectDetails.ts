import { getSessionUser } from '@/shared/utils/getSessionUser'
import { ProjectDetailsResult } from '@/shared/types/projects/project'

export async function fetchProjectDetails(projectId: string): Promise<ProjectDetailsResult> {
  const { supabase, user } = await getSessionUser()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*, clients(name)")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (projectError || !project) {
    throw new Error(projectError?.message || "Projet non trouvé")
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("status", { ascending: true })
    .order("due_date", { ascending: true })

  const { data: timeEntries } = await supabase
    .from("time_entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("client_id", project.client_id)
    .is("task_id", null)
    .order("start_time", { ascending: false })

  const { data: taskTimeEntries } = await supabase
    .from("time_entries")
    .select("*")
    .in("task_id", tasks?.map(t => t.id) || [])
    .order("start_time", { ascending: false })

  const { data: teamMembers } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", user.id)

  return {
    project,
    tasks: tasks || [],
    timeEntries: [...(timeEntries || []), ...(taskTimeEntries || [])],
    userId: user.id,
    teamMembers: teamMembers || []
  }
}
