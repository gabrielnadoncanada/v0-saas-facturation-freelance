import { getProjectAction } from "@/features/project/shared/actions/getProject.action"
import { ProjectDetails } from "@/features/project/shared/ProjectDetails"
import { notFound, redirect } from "next/navigation"
import { Project } from "@/shared/types/projects/project"
import { Task } from "@/shared/types/tasks/task"

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
      project={result.data!.project as Project}
      tasks={result.data!.tasks as Task[]}
    />
  )
}
