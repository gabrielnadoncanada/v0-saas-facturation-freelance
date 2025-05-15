import { TaskForm } from "@/features/task/shared/TaskForm"
import { getTaskFormDataAction } from "@/actions/tasks/get-form-data"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewTaskPage({
  params,
}: {
  params: { id: string }
}) {
  // Utiliser le Server Action pour récupérer les données nécessaires
  const result = await getTaskFormDataAction(params.id)

  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    notFound()
  }

  const { project, teamMembers } = result

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center space-x-4">
        <Link href={`/dashboard/projects/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle tâche</h1>
          <p className="text-muted-foreground">Projet: {project.name}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <TaskForm
          projectId={params.id}
          teamMembers={teamMembers}
          onSuccess={() => redirect(`/dashboard/projects/${params.id}`)}
        />
      </div>
    </div>
  )
}
