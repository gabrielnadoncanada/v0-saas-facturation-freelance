import { ProjectForm } from "@/features/project/shared/ui/ProjectForm"
import { getClientsAction } from "@/features/client/list/actions/getClients.action"
import { redirect } from "next/navigation"

export default async function NewProjectPage() {
  const result = await getClientsAction()

  if (!result.success) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau projet</h1>
        <p className="text-muted-foreground">Créez un nouveau projet et associez-le à un client</p>
      </div>

      <ProjectForm clients={result.data} project={null} />
    </div>
  )
}
