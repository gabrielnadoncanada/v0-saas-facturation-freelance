'use server';

import { getRecentInvoices } from '@/features/dashboard/view/model/getRecentInvoices';
import { getRecentProjects } from '@/features/dashboard/view/model/getRecentProjects';
import { getUpcomingTasks } from '@/features/dashboard/view/model/getUpcomingTasks';
import { getOrganizationStats } from '@/features/dashboard/view/model/getOrganizationStats';
import { getSessionUser } from '@/shared/utils/getSessionUser';

export async function getDashboardData() {
  try {
    const [invoices, projects, tasks, stats] = await Promise.all([
      getRecentInvoices(),
      getRecentProjects(),
      getUpcomingTasks(),
      getOrganizationStats(),
    ]);

    return {
      invoices,
      projects,
      tasks,
      stats,
    };
  } catch {
    // Si l'utilisateur n'est pas connecté (middleware redirigera), on retourne des valeurs vides
    return {
      invoices: [],
      projects: [],
      tasks: [],
      stats: null,
    };
  }
}
