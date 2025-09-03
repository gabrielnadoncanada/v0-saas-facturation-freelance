import { ProjectFormSchema } from '@/features/project/shared/schema/project.schema';
import { Project } from '@/features/project/shared/types/project.types';
import { getSessionUserDrizzle } from '@/shared/utils/getSessionUserDrizzle';
import { ProjectQueries } from '@/shared/lib/drizzle/queries/ProjectQueries';
import { NewProject } from '@/shared/lib/drizzle/types';

export async function createProject(formData: ProjectFormSchema): Promise<Project> {
  const { organization } = await getSessionUserDrizzle();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  // Convert to camelCase for Drizzle schema
  const projectData: NewProject = {
    name: formData.name,
    description: formData.description,
    budget: formData.budget,
    startDate: formData.startDate,
    endDate: formData.endDate,
    status: formData.status || 'active',
    organizationId: organization.id,
    clientId: formData.client_id,
  };

  return await ProjectQueries.create(projectData);
}
