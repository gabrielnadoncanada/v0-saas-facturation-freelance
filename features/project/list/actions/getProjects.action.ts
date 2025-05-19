'use server'

import { getProjects } from '@/features/project/list/model/getProjects'
import { Project} from '@/features/project/shared/types/project.types'
import { Result } from '@/shared/utils/result'
import { fail } from '@/shared/utils/result'
import { success } from '@/shared/utils/result'

export async function getProjectsAction(): Promise<Result<Project[]>> {
    try {
        const projects = await getProjects()
        return success(projects)
    } catch (error) {
        return fail((error as Error).message)
    }
}
