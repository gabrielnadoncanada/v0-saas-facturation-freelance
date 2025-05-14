import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentInvoices } from "@/components/dashboard/recent-invoices"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUpRight, BarChart4, Clock, FileText, Users, Briefcase } from "lucide-react"
import Link from "next/link"
import { getDashboardData } from "@/actions/dashboard/dashboard"

export default async function DashboardPage() {
  // Récupérer les données du tableau de bord
  // Le middleware s'occupera de rediriger si l'utilisateur n'est pas authentifié
  const { invoices, projects, tasks, stats } = await getDashboardData()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="mb-0 space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">Bienvenue sur votre espace de travail</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/invoices/new">
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Nouvelle facture
            </Button>
          </Link>
          <Link href="/dashboard/projects/new">
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Nouveau projet
            </Button>
          </Link>
        </div>
      </div>

      <DashboardCards stats={stats} />

      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-xl overflow-hidden transition-all duration-200">
          <CardHeader className="p-5 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Aperçu financier</CardTitle>
                <CardDescription>Suivi de vos revenus et factures</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <BarChart4 className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DashboardCharts userId={stats?.user_id} />
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-xl overflow-hidden transition-all duration-200">
            <CardHeader className="p-5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Factures récentes</CardTitle>
                  <CardDescription>Les dernières factures créées</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link href="/dashboard/invoices">
                    Voir tout
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <RecentInvoices invoices={invoices || []} />
            </CardContent>
          </Card>

          <Card className="rounded-xl overflow-hidden transition-all duration-200">
            <CardHeader className="p-5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Projets actifs</CardTitle>
                  <CardDescription>Vos projets en cours</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link href="/dashboard/projects">
                    Voir tout
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <RecentProjects projects={projects || []} />
            </CardContent>
          </Card>

          <Card className="rounded-xl overflow-hidden transition-all duration-200">
            <CardHeader className="p-5 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tâches à venir</CardTitle>
                  <CardDescription>Vos prochaines échéances</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link href="/dashboard/projects">
                    Voir tout
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <UpcomingTasks tasks={tasks || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl overflow-hidden transition-all duration-200">
          <CardHeader className="p-5 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Actions rapides</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/invoices/new">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-3 flex flex-col items-center gap-2 rounded-lg"
                >
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-xs font-medium">Nouvelle facture</span>
                </Button>
              </Link>
              <Link href="/dashboard/clients/new">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-3 flex flex-col items-center gap-2 rounded-lg"
                >
                  <Users className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-medium">Nouveau client</span>
                </Button>
              </Link>
              <Link href="/dashboard/projects/new">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-3 flex flex-col items-center gap-2 rounded-lg"
                >
                  <Briefcase className="h-5 w-5 text-purple-500" />
                  <span className="text-xs font-medium">Nouveau projet</span>
                </Button>
              </Link>
              <Link href="/dashboard/time-tracking">
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 px-3 flex flex-col items-center gap-2 rounded-lg"
                >
                  <Clock className="h-5 w-5 text-green-500" />
                  <span className="text-xs font-medium">Suivi du temps</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
