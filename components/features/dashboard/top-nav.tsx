"use client"

import React from "react"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { UserNav } from "@/components/features/dashboard/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/features/dashboard/mobile-nav"
import { APP_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Bell, Search, Plus, FileText, Users, Briefcase, X, Calendar, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User } from "@supabase/supabase-js"

interface TopNavProps {
  user: User
  profile: any
}

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "info" | "success" | "warning" | "error"
}

type QuickAction = {
  title: string
  href: string
  icon: React.ElementType
  description: string
  color: string
}

const quickActions: QuickAction[] = [
  {
    title: "Nouveau client",
    href: "/dashboard/clients/new",
    icon: Users,
    description: "Ajouter un nouveau client à votre liste",
    color: "bg-blue-500",
  },
  {
    title: "Nouvelle facture",
    href: "/dashboard/invoices/new",
    icon: FileText,
    description: "Créer une nouvelle facture",
    color: "bg-green-500",
  },
  {
    title: "Nouveau projet",
    href: "/dashboard/projects/new",
    icon: Briefcase,
    description: "Démarrer un nouveau projet",
    color: "bg-purple-500",
  },
  {
    title: "Suivi du temps",
    href: "/dashboard/time-tracking",
    icon: Clock,
    description: "Enregistrer votre temps de travail",
    color: "bg-orange-500",
  },
  {
    title: "Rendez-vous",
    href: "/dashboard/calendar/new",
    icon: Calendar,
    description: "Planifier un nouveau rendez-vous",
    color: "bg-pink-500",
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouvelle facture payée",
    description: "Le client Acme Inc. a payé la facture #INV-2023-001",
    time: "Il y a 5 minutes",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Rappel d'échéance",
    description: "La facture #INV-2023-002 est due dans 3 jours",
    time: "Il y a 2 heures",
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Nouveau commentaire",
    description: "Jean Dupont a commenté sur le projet 'Site web'",
    time: "Hier",
    read: true,
    type: "info",
  },
]

export function TopNav({ user, profile }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Breadcrumb generation based on pathname
  const generateBreadcrumbs = () => {
    if (pathname === "/dashboard") {
      return [{ label: "Tableau de bord", href: "/dashboard" }]
    }

    const paths = pathname.split("/").filter(Boolean)
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`
      let label = path.charAt(0).toUpperCase() + path.slice(1)

      // Replace IDs with more readable labels
      if (path.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        label = "Détails"
      }

      // Make labels more user-friendly
      if (label === "Dashboard") label = "Tableau de bord"
      if (label === "Clients") label = "Clients"
      if (label === "Invoices") label = "Factures"
      if (label === "New") label = "Nouveau"
      if (label === "Projects") label = "Projets"
      if (label === "Time-tracking") label = "Suivi du temps"
      if (label === "Settings") label = "Paramètres"
      if (label === "Edit") label = "Modifier"
      if (label === "Payments") label = "Paiements"

      return { label, href }
    })
  }

  const breadcrumbs = generateBreadcrumbs()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mock search functionality
  useEffect(() => {
    if (searchQuery.length > 1) {
      // Mock search results
      const results = [
        { type: "client", title: "Acme Inc.", href: "/dashboard/clients/1" },
        { type: "facture", title: "Facture #INV-2023-001", href: "/dashboard/invoices/1" },
        { type: "projet", title: "Refonte site web", href: "/dashboard/projects/1" },
      ].filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200",
          isScrolled ? "bg-white/90 backdrop-blur-md dark:bg-slate-900/90 shadow-sm" : "bg-white dark:bg-slate-900",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((crumb, index) => {
                    // Don't render the last separator
                    const isLast = index === breadcrumbs.length - 1

                    return (
                      <React.Fragment key={crumb.href}>
                        <BreadcrumbItem>
                          {index < breadcrumbs.length - 1 ? (
                            <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                          ) : (
                            <span className="font-medium text-foreground">{crumb.label}</span>
                          )}
                        </BreadcrumbItem>

                        {/* Only render separator between items, not after the last item */}
                        {!isLast && (
                          <span className="mx-2 inline-flex items-center">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        )}
                      </React.Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="text-base font-semibold md:hidden">
              {breadcrumbs[breadcrumbs.length - 1]?.label || APP_NAME}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>

            {/* Desktop Search Button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden h-9 gap-1 md:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline-block">Rechercher...</span>
              <kbd className="pointer-events-none ml-2 hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Quick Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Actions rapides</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px]">
                <DropdownMenuLabel>Actions rapides</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {quickActions.map((action) => (
                    <DropdownMenuItem
                      key={action.href}
                      onClick={() => router.push(action.href)}
                      className="flex cursor-pointer items-center gap-2 py-2"
                    >
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", action.color)}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{action.title}</span>
                        <span className="text-xs text-muted-foreground">{action.description}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-full">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[320px] md:w-[380px]">
                <div className="flex items-center justify-between p-4">
                  <DropdownMenuLabel className="text-base">Notifications</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto px-2 py-1 text-xs">
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    <div className="flex flex-col">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex cursor-pointer gap-4 p-4 hover:bg-muted/50",
                            !notification.read && "bg-muted/30",
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex-shrink-0">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full",
                                notification.type === "success" &&
                                  "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                                notification.type === "warning" &&
                                  "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
                                notification.type === "error" &&
                                  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
                                notification.type === "info" &&
                                  "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                              )}
                            >
                              <Bell className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-medium">{notification.title}</p>
                              {!notification.read && (
                                <Badge
                                  variant="outline"
                                  className="h-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-white"
                                >
                                  Nouveau
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-lg font-medium">Aucune notification</p>
                      <p className="text-sm text-muted-foreground">Vous n'avez pas de notifications pour le moment.</p>
                    </div>
                  )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => router.push("/dashboard/notifications")}
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />
            <UserNav user={user} profile={profile} />
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Recherche</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des clients, factures, projets..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Effacer</span>
              </Button>
            )}
          </div>

          <ScrollArea className="h-[300px]">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                    onClick={() => {
                      router.push(result.href)
                      setSearchOpen(false)
                    }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      {result.type === "client" && <Users className="h-5 w-5 text-primary" />}
                      {result.type === "facture" && <FileText className="h-5 w-5 text-primary" />}
                      {result.type === "projet" && <Briefcase className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{result.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{result.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.length > 1 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-medium">Aucun résultat trouvé</p>
                <p className="text-sm text-muted-foreground">Aucun résultat trouvé pour "{searchQuery}"</p>
              </div>
            ) : (
              <div className="p-4">
                <p className="mb-4 text-sm text-muted-foreground">Recherches récentes</p>
                <div className="space-y-2">
                  {["Acme Inc.", "Facture #INV-2023-001", "Projet Site Web"].map((term, i) => (
                    <div
                      key={i}
                      className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                      onClick={() => setSearchQuery(term)}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span>{term}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <X className="h-3 w-3" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="rounded border bg-muted px-1.5 font-mono">↑</kbd>
              <kbd className="rounded border bg-muted px-1.5 font-mono">↓</kbd>
              <span>pour naviguer</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="rounded border bg-muted px-1.5 font-mono">Esc</kbd>
              <span>pour fermer</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Search Dialog */}
      <Dialog open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <DialogContent className="max-w-full p-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Effacer</span>
              </Button>
            )}
          </div>

          <ScrollArea className="max-h-[60vh]">
            {searchResults.length > 0 ? (
              <div className="space-y-2 pt-2">
                {searchResults.map((result, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                    onClick={() => {
                      router.push(result.href)
                      setMobileSearchOpen(false)
                    }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                      {result.type === "client" && <Users className="h-5 w-5 text-primary" />}
                      {result.type === "facture" && <FileText className="h-5 w-5 text-primary" />}
                      {result.type === "projet" && <Briefcase className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="font-medium">{result.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">{result.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.length > 1 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-lg font-medium">Aucun résultat trouvé</p>
                <p className="text-sm text-muted-foreground">Aucun résultat trouvé pour "{searchQuery}"</p>
              </div>
            ) : (
              <div className="p-2 pt-4">
                <p className="mb-2 text-sm text-muted-foreground">Recherches récentes</p>
                <div className="space-y-2">
                  {["Acme Inc.", "Facture #INV-2023-001", "Projet Site Web"].map((term, i) => (
                    <div
                      key={i}
                      className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                      onClick={() => setSearchQuery(term)}
                    >
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span>{term}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <X className="h-3 w-3" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
