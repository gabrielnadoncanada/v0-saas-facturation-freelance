import { db } from '../db'
import { projects } from '../schema'
import type { Project, NewProject } from '../types'

export class ProjectQueries {
  // Create a new project
  static async create(data: NewProject): Promise<Project> {
    const result = await db.insert(projects).values(data).returning()
    return result[0]
  }
}

