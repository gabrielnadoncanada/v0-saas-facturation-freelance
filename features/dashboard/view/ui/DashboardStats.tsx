import { DashboardCards } from '@/components/dashboard/dashboard-cards'
import { type DashboardStats } from '@/features/dashboard/shared/types' // si existant

export function DashboardStats({ stats }: { stats: DashboardStats }) {
  return <DashboardCards stats={stats} />
}
