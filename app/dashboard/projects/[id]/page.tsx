import { getProjectDetails } from "@/app/actions/projects"
import { ProjectDetails } from "@/components/features/projects/project-details"
import { notFound, redirect } from "next/navigation"

export default async function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const result = await getProjectDetails(params.id)

  if (!result.success) {
    if (result.error === "Non authentifié") {
      redirect("/login")
    }
    notFound()
  }

  return (
    <ProjectDetails
      project={result.project}
      tasks={result.tasks}
      timeEntries={result.timeEntries}
      userId={result.userId}
      teamMembers={result.teamMembers}
    />
  )
}
