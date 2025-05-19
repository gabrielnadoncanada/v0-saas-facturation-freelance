"use client"

import { useProjectDetails } from "@/features/project/shared/hooks/useProjectDetails"
import { ProjectDetailsView } from "@/features/project/shared/ui/ProjectDetailsView"
import { Task } from "@/features/task/shared/types/task.types"
import { Project } from "@/features/project/shared/types/project.types"

export function ProjectDetails({ project}: { project: Project}) {
  const details = useProjectDetails(project)
  return (
    <ProjectDetailsView
      project={project}
      {...details}
    />
  )
}
