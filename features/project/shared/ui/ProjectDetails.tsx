"use client"

import { useProjectDetails } from "@/features/project/shared/hooks/useProjectDetails"
import { ProjectDetailsView } from "@/features/project/shared/ui/ProjectDetailsView"
import { Task } from "@/features/task/shared/types/task.types"
import { Project } from "@/features/project/shared/types/project.types"
import { TeamMember } from "@/features/team/shared/types/team.types"

export function ProjectDetails({ project, teamMembers }: { project: Project; teamMembers: TeamMember[] }) {
  const details = useProjectDetails(project)
  return (
    <ProjectDetailsView
      project={project}
      teamMembers={teamMembers}
      {...details}
    />
  )
}
