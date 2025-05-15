'use server'

import { fetchAllProjects } from './fetchAllProjects'
import { Project} from '@/shared/types/projects/project'

export async function getAllProjectsAction(): Promise<Project[]> {
    return await fetchAllProjects()
}
