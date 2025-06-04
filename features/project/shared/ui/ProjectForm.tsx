'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/features/project/shared/types/project.types';
import { Client } from '@/features/client/shared/types/client.types';
import { useProjectForm } from '@/features/project/shared/hooks/useProjectForm';
import { ProjectFormView } from '@/features/project/shared/ui/ProjectFormView';

export function ProjectForm({ clients, project }: { clients: Client[]; project: Project | null }) {
  const router = useRouter();

  const { form, onSubmit, isLoading, error } = useProjectForm({
    project,
    router,
  });

  return (
    <ProjectFormView
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
      clients={clients}
      project={project}
    />
  );
}
