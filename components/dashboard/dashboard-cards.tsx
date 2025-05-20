"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/shared/lib/utils"
import { CreditCard, Users, Clock, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface DashboardCardsProps {
  stats: {
    total_invoiced: number
    total_paid: number
    total_outstanding: number
    total_overdue: number
    client_count: number
    invoice_count: number
    time_tracked_hours: number
    project_count?: number
    completed_tasks_count?: number
  } | null
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  const router = useRouter()

  // Default values if stats are not available
  const defaultStats = {
    total_invoiced: 0,
    total_paid: 0,
    total_outstanding: 0,
    total_overdue: 0,
    client_count: 0,
    invoice_count: 0,
    time_tracked_hours: 0,
    project_count: 0,
    completed_tasks_count: 0,
  }

  const data = stats || defaultStats

  // Calculate payment rate
  const paymentRate = data.total_invoiced > 0 ? (data.total_paid / data.total_invoiced) * 100 : 0
  // Calculate active clients rate (currently 80% of client_count)
  const activeClientsRate = data.client_count > 0 ? (data.client_count * 0.8) / data.client_count * 100 : 0
  // Calculate project completion rate
  const projectCompletionRate = data.project_count && data.project_count > 0 && data.completed_tasks_count !== undefined
    ? (data.completed_tasks_count / data.project_count) * 100
    : 0
  // Calculate billable hours rate (currently 70% of time_tracked_hours)
  const billableHoursRate = 70 // If you have a dynamic value, replace this

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="rounded-xl overflow-hidden transition-all duration-200 overflow-hidden">
        <CardHeader className="p-5 border-b bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Total facturé</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">{formatCurrency(data.total_invoiced)}</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Taux de paiement</span>
                <span className={paymentRate >= 75 ? "text-green-500" : "text-amber-500"}>
                  {paymentRate.toFixed(0)}%
                </span>
              </div>
              <Progress value={paymentRate} className="h-1.5" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(data.total_outstanding)} en attente
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => router.push("/dashboard/invoices")}
                >
                  Détails
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl overflow-hidden transition-all duration-200 overflow-hidden">
        <CardHeader className="p-5 border-b bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">{data.client_count}</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Clients actifs</span>
                <span className="text-green-500">{Math.round(data.client_count * 0.8)}</span>
              </div>
              <Progress value={activeClientsRate} className="h-1.5" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {data.invoice_count} facture{data.invoice_count !== 1 ? "s" : ""}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => router.push("/dashboard/clients")}
                >
                  Détails
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl overflow-hidden transition-all duration-200 overflow-hidden">
        <CardHeader className="p-5 border-b bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">{data.project_count || 0}</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progression</span>
                <span className="text-blue-500">{data.completed_tasks_count || 0} tâches terminées</span>
              </div>
              <Progress value={projectCompletionRate} className="h-1.5" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {Math.round((data.project_count || 0) * 0.65)} projets en cours
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => router.push("/dashboard/projects")}
                >
                  Détails
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl overflow-hidden transition-all duration-200 overflow-hidden">
        <CardHeader className="p-5 border-b bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Heures suivies</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-col space-y-1">
            <div className="text-2xl font-bold">{data.time_tracked_hours.toFixed(1)}h</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Ce mois</span>
                <span className="text-green-500">{formatCurrency(data.time_tracked_hours * 50)}</span>
              </div>
              <Progress value={billableHoursRate} className="h-1.5" />
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {Math.round(data.time_tracked_hours * 0.7)}h facturables
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => router.push("/dashboard/time-tracking")}
                >
                  Détails
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
