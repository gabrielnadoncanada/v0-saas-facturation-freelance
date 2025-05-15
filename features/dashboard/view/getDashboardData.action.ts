'use server'

import { fetchRecentInvoices } from './fetchRecentInvoices'
import { fetchRecentProjects } from './fetchRecentProjects'
import { fetchUpcomingTasks } from './fetchUpcomingTasks'
import { fetchUserStats } from './fetchUserStats'
import { getSessionUser } from '@/shared/utils/getSessionUser'

export async function getDashboardData() {
  try {
    const [invoices, projects, tasks, stats] = await Promise.all([
      fetchRecentInvoices(),
      fetchRecentProjects(),
      fetchUpcomingTasks(),
      fetchUserStats(),
    ])

    return {
      invoices,
      projects,
      tasks,
      stats,
    }
  } catch {
    // Si l'utilisateur n'est pas connecté (middleware redirigera), on retourne des valeurs vides
    return {
      invoices: [],
      projects: [],
      tasks: [],
      stats: null,
    }
  }
}
