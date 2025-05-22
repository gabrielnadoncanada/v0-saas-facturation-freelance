import { TimeEntryForm } from '@/features/time-tracking/shared/ui/TimeEntryForm'
import { getProjectsAction } from '@/features/project/list/actions/getProjects.action'
import { redirect } from 'next/navigation'

export default async function NewTimeEntryPage() {
  const projects = await getProjectsAction()

  if (!projects.success) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle entrée de temps</h1>
        <p className="text-muted-foreground">Enregistrez le temps passé sur un projet ou une tâche</p>
      </div>

      <TimeEntryForm projects={projects.data} entry={null} />
    </div>
  )
}
