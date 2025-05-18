"use client"

import { useProjectDetails } from "./hooks/useProjectDetails"
import { ProjectDetailsView } from "./ui/ProjectDetailsView"
import { Task } from "@/shared/types/tasks/task"
import { Project } from "@/shared/types/projects/project"

export function ProjectDetails({ project, tasks }: { project: Project, tasks: Task[]}) {
  const details = useProjectDetails({ project, tasks })
  return (
    <ProjectDetailsView
      project={project}
      tasks={tasks}
      {...details}
    />
  )
}
