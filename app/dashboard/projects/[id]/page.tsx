import { getProjectAction } from "@/actions/projects/get"
import { ProjectDetails } from "@/components/projects/project-details"
import { notFound, redirect } from "next/navigation"
import { Project } from "@/types/projects/project"
import { Task } from "@/types/tasks/task"
import { TimeEntry } from "@/types/time-entries/time-entry"
import { TeamMember } from "@/types/team-members/team-member"   

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
      timeEntries={result.data!.timeEntries as TimeEntry[]}
      userId={result.data!.userId}
      teamMembers={result.data!.teamMembers as TeamMember[]}
    />
  )
}
