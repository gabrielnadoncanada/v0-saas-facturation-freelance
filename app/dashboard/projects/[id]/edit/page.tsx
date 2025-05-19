import { ProjectForm } from "@/features/project/shared/ui/ProjectForm"
import { getProjectAction } from "@/features/project/shared/actions/getProject.action"
import { redirect } from "next/navigation"
import { getClientsAction } from "@/features/client/list/actions/getClients.action"

export default async function EditProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const clients = await getClientsAction()
  const result = await getProjectAction(params.id)

  if (!result.success || !clients.success) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le projet</h1>
        <p className="text-muted-foreground">Modifiez les détails du projet {result.data.name}</p>
      </div>

      <ProjectForm clients={clients.data} project={result.data} />
    </div>
  )
}
