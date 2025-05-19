import { getProjectAction } from "@/features/project/shared/actions/getProject.action"
import { ProjectDetails } from "@/features/project/shared/ui/ProjectDetails"
import { notFound, redirect } from "next/navigation"

export default async function ProjectPage({
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
    <ProjectDetails
      project={result.data}
    />
  )
}
