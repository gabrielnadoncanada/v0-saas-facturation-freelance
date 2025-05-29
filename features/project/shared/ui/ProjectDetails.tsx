"use client"

import { useProjectDetails } from "@/features/project/shared/hooks/useProjectDetails"
import { ProjectDetailsView } from "@/features/project/shared/ui/ProjectDetailsView"
import { Project } from "@/features/project/shared/types/project.types"

export function ProjectDetails({ project}: { project: Project}) {
  const details = useProjectDetails(project)
  console.log(project)
  return (
    <ProjectDetailsView
      project={project}
      {...details}
    />
  )
}
