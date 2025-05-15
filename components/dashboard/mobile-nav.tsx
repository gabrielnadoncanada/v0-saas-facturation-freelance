"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Users, FileText, Clock, CreditCard, Settings, Briefcase } from "lucide-react"
import { APP_NAME } from "@/shared/lib/constants"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navSections = [
    {
      title: "Principal",
      items: [
        {
          href: "/dashboard",
          label: "Tableau de bord",
          icon: Home,
          active: pathname === "/dashboard",
        },
        {
          href: "/dashboard/clients",
          label: "Clients",
          icon: Users,
          active: pathname.includes("/dashboard/clients"),
          badge: 3,
        },
        {
          href: "/dashboard/projects",
          label: "Projets",
          icon: Briefcase,
          active: pathname.includes("/dashboard/projects"),
          badge: 2,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          href: "/dashboard/invoices",
          label: "Factures",
          icon: FileText,
          active: pathname.includes("/dashboard/invoices"),
          badge: 1,
        },
        {
          href: "/dashboard/payments",
          label: "Paiements",
          icon: CreditCard,
          active: pathname.includes("/dashboard/payments"),
        },
      ],
    },
    {
      title: "Productivité",
      items: [
        {
          href: "/dashboard/time-tracking",
          label: "Suivi du temps",
          icon: Clock,
          active: pathname.includes("/dashboard/time-tracking"),
        },
      ],
    },
    {
      title: "Système",
      items: [
        {
          href: "/dashboard/settings",
          label: "Paramètres",
          icon: Settings,
          active: pathname.includes("/dashboard/settings"),
        },
      ],
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn("mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent md:hidden", className)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 pt-0 overflow-y-auto !min-h-screen">
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="h-5 w-5 object-contain" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-primary">{APP_NAME}</span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
          <div className="px-1 py-2">
            {navSections.map((section) => (
              <div key={section.title} className="mb-4">
                <h3 className="mb-1 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-md px-4 py-3 text-sm font-medium transition-all",
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full p-0 px-1 text-xs font-medium",
                            item.active
                              ? "border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground"
                              : "border-muted bg-muted/50 text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4 text-center text-xs text-muted-foreground">
          <p className="font-medium">{APP_NAME} v1.0</p>
          <p className="mt-1">© 2024 Tous droits réservés</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
