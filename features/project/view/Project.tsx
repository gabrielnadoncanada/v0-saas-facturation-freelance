import { Project as ProjectType } from '@/features/project/shared/types/project.types'
import { ProjectView } from '@/features/project/view/ui/ProjectView'

interface ProjectProps {
  project: ProjectType
}

export function Project({ project }: ProjectProps) {
  return <ProjectView project={project} />
} 