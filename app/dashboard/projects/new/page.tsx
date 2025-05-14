import { ProjectForm } from "@/components/projects/project-form"
import { getProjectDataAction } from "@/actions/projects/get"
import { redirect } from "next/navigation"

export default async function NewProjectPage() {
  const result = await getProjectDataAction()

  if (!result.success || !result.data) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau projet</h1>
        <p className="text-muted-foreground">Créez un nouveau projet et associez-le à un client</p>
      </div>

      <ProjectForm userId={result.data.userId} clients={result.data.clients as { id: string; name: string }[]} />
    </div>
  )
}
