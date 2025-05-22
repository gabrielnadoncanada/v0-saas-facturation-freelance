"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  UserCircle,
  Settings,
  Briefcase,
  Package,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { APP_NAME } from "@/shared/lib/constants"
import Image from "next/image"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  badge?: number | string
  isNew?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

type DashboardSidebarProps = {
  clientsCount: number
  projectsCount: number
  invoicesCount: number
  productsCount: number
  paymentsCount: number
}

export function DashboardSidebar({
  clientsCount,
  projectsCount,
  invoicesCount,
  productsCount,
  paymentsCount,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  const navSections: NavSection[] = [
    {
      title: "Principal",
      items: [
        {
          title: "Tableau de bord",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Clients",
          href: "/dashboard/clients",
          icon: Users,
          badge: clientsCount,
        },
        {
          title: "Projets",
          href: "/dashboard/projects",
          icon: Briefcase,
          badge: projectsCount,
        },
        {
          title: "Produits",
          href: "/dashboard/products",
          icon: Package,
          badge: productsCount,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          title: "Factures",
          href: "/dashboard/invoices",
          icon: FileText,
          badge: invoicesCount,
        },
        {
          title: "Paiements",
          href: "/dashboard/payments",
          icon: CreditCard,
          badge: paymentsCount,
        }
      ],
    },
    {
      title: "Système",
      items: [
        {
          title: "Profil",
          href: "/dashboard/profile",
          icon: UserCircle,
        },
        {
          title: "Paramètres",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ]

  return (
    <div className="flex h-full w-[280px] flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="flex h-16 items-center border-b px-6 py-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="h-5 w-5 object-contain" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-primary">{APP_NAME}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-8">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center px-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{section.title}</h3>
                <Separator className="ml-2 flex-1" />
              </div>
              <nav className="grid gap-1.5 px-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800/50",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge !== undefined && item.badge !== 0 && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full p-0 px-1.5 text-xs font-medium",
                            isActive
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-muted bg-muted/50 text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.isNew && (
                        <Badge className="ml-auto bg-green-500 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white dark:bg-green-600">
                          NEW
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
