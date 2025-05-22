import { getProjectAction } from "@/features/project/shared/actions/getProject.action"
import { ProjectDetails } from "@/features/project/shared/ui/ProjectDetails"
import { getTeamMembersAction } from "@/features/team/list/actions/getTeamMembers.action"
import { notFound, redirect } from "next/navigation"

export default async function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getProjectAction(params.id)
  const teamResult = await getTeamMembersAction()

  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    notFound()
  }

  const teamMembers = teamResult.success ? teamResult.data : []

  return (
    <ProjectDetails
      project={result.data}
      teamMembers={teamMembers}
    />
  )
}
