import { getDashboardData } from "@/features/dashboard/view/actions/getDashboardData.action"
import { DashboardHeader } from "@/features/dashboard/view/ui/DashboardHeader"
import { DashboardStats } from "@/features/dashboard/view/ui/DashboardStats"
import { RecentActivityColumn } from "@/features/dashboard/view/ui/RecentActivityColumn"

export default async function DashboardPage() {
  const { invoices, projects, tasks, stats } = await getDashboardData()

  return (
    <div className="flex flex-col gap-6">
    <DashboardHeader />
    <DashboardStats stats={stats} />
    <RecentActivityColumn invoices={invoices} projects={projects} tasks={tasks} />
  </div>
  )
}
