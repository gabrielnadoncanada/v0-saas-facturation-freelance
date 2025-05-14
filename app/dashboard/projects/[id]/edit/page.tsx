import { ProjectForm } from "@/components/projects/project-form"
import { getProjectAction } from "@/actions/projects/get"
import { notFound, redirect } from "next/navigation"
import { Project } from "@/types/projects/project"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getProjectAction(params.id)

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
        <p className="text-muted-foreground">Modifiez les détails du projet {result.data?.project.name}</p>
      </div>

      <ProjectForm userId={result.data?.userId} clients={result.data?.clients as { id: string; name: string }[]} project={result.data?.project} />
    </div>
  )
}
