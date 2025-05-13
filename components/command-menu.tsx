"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, CreditCard, Search, Settings, Users, FileText, Clock, Briefcase, Plus } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 sm:h-9 sm:w-60 sm:justify-start sm:px-3 sm:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline-flex">Recherche rapide...</span>
        <span className="sr-only sm:not-sr-only">Recherche</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez une commande ou recherchez..." />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Tableau de bord</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/clients"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Clients</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/projects"))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Projets</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/invoices"))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Factures</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/time-tracking"))}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Suivi du temps</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/payments"))}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Paiements</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions rapides">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/clients/new"))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Nouveau client</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/projects/new"))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Nouveau projet</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/invoices/new"))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Nouvelle facture</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/time-tracking"))}>
              <Clock className="mr-2 h-4 w-4" />
              <span>Démarrer le chronomètre</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
