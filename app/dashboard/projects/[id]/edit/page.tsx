import { ProjectForm } from "@/features/project/shared/ui/ProjectForm"
import { getProjectAction } from "@/features/project/shared/actions/getProject.action"
import { redirect } from "next/navigation"
import { getClientsAction } from "@/features/client/list/actions/getClients.action"
import FormPageLayout from "@/shared/ui/FormPageLayout"

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
    <FormPageLayout
      title="Modifier le projet"
      subtitle={`Modifiez les détails du projet ${result.data.name}`}
      backHref="/dashboard/projects"
    >
      <ProjectForm clients={clients.data} project={result.data} />
    </FormPageLayout>
  )
}
