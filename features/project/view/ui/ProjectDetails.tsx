'use client';

import { useProjectDetails } from '@/features/project/view/hooks/useProjectDetails';
import { ProjectDetailsView } from '@/features/project/view/ui/ProjectDetailsView';
import { Project } from '@/features/project/shared/types/project.types';

export function ProjectDetails({ project }: { project: Project }) {
  const details = useProjectDetails(project);

  return <ProjectDetailsView project={project} {...details} />;
}
