import { ProjectForm } from "@/features/project/shared/ui/ProjectForm"
import { getClientsAction } from "@/features/client/list/actions/getClients.action"
import { redirect } from "next/navigation"
import FormPageLayout from "@/components/layout/FormPageLayout"

export default async function NewProjectPage() {
  const result = await getClientsAction()

  if (!result.success) {
    redirect("/login")
  }

  return (
    <FormPageLayout
      title="Nouveau projet"
      subtitle="Créez un nouveau projet et associez-le à un client"
      backHref="/dashboard/projects"
    >
      <ProjectForm clients={result.data} project={null} />
    </FormPageLayout>
  )
}
