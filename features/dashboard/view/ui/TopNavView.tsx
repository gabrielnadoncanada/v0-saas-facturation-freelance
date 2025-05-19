import React from "react"
import { Bell, Search, Plus, FileText, Users, Briefcase, X, Calendar, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { APP_NAME } from "@/shared/lib/constants"
import { cn } from "@/shared/lib/utils"
import type { TopNavProps, Notification, QuickAction } from "../types/top-nav.types"

interface TopNavViewProps {
  user: TopNavProps["user"]
  profile: TopNavProps["profile"]
  breadcrumbs: { label: string; href: string }[]
  isScrolled: boolean
  unreadCount: number
  notifications: Notification[]
  markAllAsRead: () => void
  markAsRead: (id: string) => void
  quickActions: QuickAction[]
  onQuickAction: (href: string) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  searchResults: any[]
  onSearchResultClick: (href: string) => void
  mobileSearchOpen: boolean
  setMobileSearchOpen: (open: boolean) => void
  onSeeAllNotifications: () => void
}

export function TopNavView({
  user,
  profile,
  breadcrumbs,
  isScrolled,
  unreadCount,
  notifications,
  markAllAsRead,
  markAsRead,
  quickActions,
  onQuickAction,
  searchOpen,
  setSearchOpen,
  searchQuery,
  setSearchQuery,
  searchResults,
  onSearchResultClick,
  mobileSearchOpen,
  setMobileSearchOpen,
  onSeeAllNotifications,
}: TopNavViewProps) {
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
                      onClick={() => onQuickAction(action.href)}
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
                    onClick={onSeeAllNotifications}
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
                    onClick={() => onSearchResultClick(result.href)}
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
                    onClick={() => onSearchResultClick(result.href)}
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