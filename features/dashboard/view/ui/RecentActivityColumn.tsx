import { RecentInvoices } from '@/features/dashboard/view/ui/RecentInvoices'
import { RecentProjects } from '@/features/dashboard/view/ui/RecentProjects'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function RecentActivityColumn({ invoices, projects, tasks }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DashboardSection
        title="Factures récentes"
        description="Les dernières factures créées"
        link="/dashboard/invoices"
        children={<RecentInvoices invoices={invoices || []} />}
      />
      <DashboardSection
        title="Projets actifs"
        description="Vos projets en cours"
        link="/dashboard/projects"
        children={<RecentProjects projects={projects || []} />}
      />
    </div>
  )
}

function DashboardSection({ title, description, link, children }: { title: string; description: string; link: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-xl overflow-hidden transition-all duration-200">
      <CardHeader className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href={link}>
              Voir tout
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}
