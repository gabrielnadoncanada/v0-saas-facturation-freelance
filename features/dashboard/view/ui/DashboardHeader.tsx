'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function DashboardHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace de travail</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href="/dashboard/invoices/new">
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Nouvelle facture
          </Button>
        </Link>
        <Link href="/dashboard/projects/new">
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Nouveau projet
          </Button>
        </Link>
      </div>
    </div>
  )
}
