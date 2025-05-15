"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, MoreHorizontal, Search, Trash, Receipt } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDate, formatDuration } from "@/shared/lib/utils"
import Link from "next/link"

interface TimeEntry {
  id: string
  description: string
  start_time: string
  end_time: string | null
  duration: number | null
  hourly_rate: number
  billable: boolean
  billed: boolean
  clients: {
    name: string
  }
}

interface TimeEntriesTableProps {
  timeEntries: TimeEntry[]
}

export function TimeEntriesTable({ timeEntries }: TimeEntriesTableProps) {
  const router = useRouter()
  const supabase = createClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

  const filteredEntries = timeEntries.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.clients.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!entryToDelete) return

    const { error } = await supabase.from("time_entries").delete().eq("id", entryToDelete)

    if (!error) {
      router.refresh()
    }

    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }

  const addToInvoice = async (entryId: string) => {
    // This would typically open a modal to select an invoice or create a new one
    // For now, we'll just mark it as billed
    const { error } = await supabase.from("time_entries").update({ billed: true }).eq("id", entryId)

    if (!error) {
      router.refresh()
    }
  }

  // Vérifier s'il y a des entrées non facturées
  const hasUnbilledEntries = timeEntries.some((entry) => entry.billable && !entry.billed && entry.end_time)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Entrées de temps récentes</h2>
        <div className="flex items-center space-x-2">
          {hasUnbilledEntries && (
            <Link href="/dashboard/time-tracking/invoice">
              <Button variant="outline">
                <Receipt className="mr-2 h-4 w-4" />
                Convertir en facture
              </Button>
            </Link>
          )}
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Taux</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune entrée de temps trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.description}</TableCell>
                  <TableCell>{entry.clients.name}</TableCell>
                  <TableCell>{formatDate(entry.start_time)}</TableCell>
                  <TableCell>{entry.duration ? formatDuration(entry.duration) : "En cours"}</TableCell>
                  <TableCell>{entry.hourly_rate} €/h</TableCell>
                  <TableCell>
                    {entry.billed ? (
                      <Badge className="bg-green-100 text-green-800">Facturé</Badge>
                    ) : entry.billable ? (
                      <Badge className="bg-blue-100 text-blue-800">Facturable</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Non facturable</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {entry.duration && !entry.billed && entry.billable && (
                          <DropdownMenuItem onClick={() => addToInvoice(entry.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ajouter à une facture
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setEntryToDelete(entry.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement cette entrée de temps.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
