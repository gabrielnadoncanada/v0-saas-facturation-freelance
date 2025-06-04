import { getSessionUser } from '@/shared/utils/getSessionUser'
import { Project } from '@/features/project/shared/types/project.types'
import { fetchById } from '@/shared/services/supabase/crud'

export async function getProjectDetails(projectId: string): Promise<Project> {
  const { supabase, organization } = await getSessionUser()
  
  if (!organization) {
    throw new Error("Aucune organisation active")
  }

  const project = await fetchById<Project>(
    supabase,
    'projects',
    projectId,
    `
      *,
      client:clients(name),
      tasks(*, time_entries(*))
    `,
    { organization_id: organization.id }
  )

  // Transform tasks into a hierarchical structure
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