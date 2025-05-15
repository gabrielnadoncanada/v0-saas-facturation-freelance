import { ProjectForm } from "@/features/project/shared/ProjectForm"
import { fetchAllClients } from "@/features/client"

export default async function NewProjectPage() {
  const result = await fetchAllClients()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau projet</h1>
        <p className="text-muted-foreground">Créez un nouveau projet et associez-le à un client</p>
      </div>

      <ProjectForm clients={result} project={null} />
    </div>
  )
}
