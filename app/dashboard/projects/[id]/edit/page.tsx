import { ProjectForm } from "@/components/features/projects/project-form"
import { getProjectData } from "@/app/actions/projects"
import { notFound, redirect } from "next/navigation"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getProjectData(params.id)

  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le projet</h1>
        <p className="text-muted-foreground">Modifiez les détails du projet {result.project.name}</p>
      </div>

      <ProjectForm userId={result.project.user_id} clients={result.clients} project={result.project} />
    </div>
  )
}
