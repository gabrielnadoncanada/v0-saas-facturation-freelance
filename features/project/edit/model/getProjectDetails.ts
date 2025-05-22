import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project } from '@/features/project/shared/types/project.types'
import { extractDataOrThrow } from '@/shared/utils/extractDataOrThrow'

export async function getProjectDetails(projectId: string): Promise<Project> {
  const { supabase, user } = await getSessionUser()

  const res = await supabase
    .from("projects")
    .select(`
      *,
      clients(name),
      tasks(*, time_entries(*))
    `)
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  const project = extractDataOrThrow<Project>(res)

  const tasks = project.tasks as any[]
  const map = new Map<string, any>()
  tasks.forEach((t) => {
    t.subtasks = []
    map.set(t.id, t)
  })

  const topLevel: any[] = []
  tasks.forEach((t) => {
    if (t.parent_task_id) {
      const parent = map.get(t.parent_task_id)
      if (parent) parent.subtasks.push(t)
    } else {
      topLevel.push(t)
    }
  })

  project.tasks = topLevel as any
  return project
}
