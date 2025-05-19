import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Notification, QuickAction, TopNavProps } from "@/features/dashboard/view/types/top-nav.types"
import { APP_NAME } from "@/shared/lib/constants"
import { Users, FileText, Briefcase, Clock, Calendar } from "lucide-react"

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

export function useTopNav() {
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

  const onQuickAction = (href: string) => {
    router.push(href)
  }

  const onSearchResultClick = (href: string) => {
    router.push(href)
    setSearchOpen(false)
    setMobileSearchOpen(false)
  }

  const onSeeAllNotifications = () => {
    router.push("/dashboard/notifications")
  }

  return {
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
  }
} 