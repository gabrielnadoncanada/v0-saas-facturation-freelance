"use client"

import { useProjectDetails } from "./hooks/useProjectDetails"
import { ProjectDetailsView } from "./ui/ProjectDetailsView"
import { Task } from "@/shared/types/tasks/task"
import { Project } from "@/shared/types/projects/project"

export function ProjectDetails({ project, tasks, timeEntries, userId, teamMembers }: { project: Project, tasks: Task[], timeEntries: any[], teamMembers: any[] }) {
  const details = useProjectDetails({ project, tasks, timeEntries, userId, teamMembers })
  return (
    <ProjectDetailsView
      project={project}
      tasks={tasks}
      timeEntries={timeEntries}
      teamMembers={teamMembers}
      {...details}
    />
  )
}
