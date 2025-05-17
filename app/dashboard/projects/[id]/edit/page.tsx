import { ProjectForm } from "@/features/project/shared/ProjectForm"
import { getProjectAction } from "@/features/project/shared/actions/getProject.action"
import { notFound, redirect } from "next/navigation"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getProjectAction(params.id)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le projet</h1>
        <p className="text-muted-foreground">Modifiez les détails du projet {result.name}</p>
      </div>

      <ProjectForm  clients={result.data?.clients as { id: string; name: string }[]} project={result.data?.project} />
    </div>
  )
}
