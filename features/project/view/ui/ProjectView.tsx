'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/features/project/shared/types/project.types';
import { ProjectDetails } from '@/features/project/view/ui/ProjectDetails';

interface ProjectViewProps {
  project: Project;
}

export function ProjectView({ project }: ProjectViewProps) {
  const router = useRouter();

  useEffect(() => {
    // This ensures the page refreshes when navigating back to it
    router.refresh();
  }, [router]);

  return <ProjectDetails project={project} />;
}
