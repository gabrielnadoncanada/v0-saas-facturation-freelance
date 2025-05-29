'use server'

import { getProjects } from '@/features/project/list/model/getProjects'
import { Project} from '@/features/project/shared/types/project.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function getProjectsAction(): Promise<Result<Project[]>> {
    return withAction(async () => {
        const projects = await getProjects()
        return projects
    })
}
