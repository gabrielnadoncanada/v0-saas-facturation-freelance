import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Search, Trash } from "lucide-react"
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
import { formatCurrency, formatDate } from "@/shared/lib/utils"
import { ProjectWithClient } from "../hooks/useProjectsTable"
import React from "react"

interface ProjectsTableViewProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  deleteDialogOpen: boolean
  setDeleteDialogOpen: (v: boolean) => void
  projectToDelete: string | null
  setProjectToDelete: (v: string | null) => void
  isDeleting: boolean
  deleteError: string | null
  filteredProjects: ProjectWithClient[]
  handleDelete: () => void
  onView: (id: string) => void
  onEdit: (id: string) => void
}

export function ProjectsTableView({
  searchTerm,
  setSearchTerm,
  deleteDialogOpen,
  setDeleteDialogOpen,
  projectToDelete,
  setProjectToDelete,
  isDeleting,
  deleteError,
  filteredProjects,
  handleDelete,
  onView,
  onEdit,
}: ProjectsTableViewProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>
      case "on_hold":
        return <Badge className="bg-yellow-100 text-yellow-800">En pause</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher des projets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle sm:px-0 ">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-3 py-3.5 sm:px-6">Nom</TableHead>
                  <TableHead className="px-3 py-3.5 sm:px-6">Client</TableHead>
                  <TableHead className="px-3 py-3.5 sm:px-6">Statut</TableHead>
                  <TableHead className="px-3 py-3.5 sm:px-6">Date de début</TableHead>
                  <TableHead className="px-3 py-3.5 sm:px-6">Date de fin</TableHead>
                  <TableHead className="px-3 py-3.5 sm:px-6">Budget</TableHead>
                  <TableHead className="w-[100px] px-3 py-3.5 sm:px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucun projet trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium px-3 py-4 sm:px-6">{project.name}</TableCell>
                      <TableCell className="px-3 py-4 sm:px-6">{project.clients?.name || "-"}</TableCell>
                      <TableCell className="px-3 py-4 sm:px-6">{getStatusBadge(project.status)}</TableCell>
                      <TableCell className="px-3 py-4 sm:px-6">
                        {project.start_date ? formatDate(project.start_date) : "-"}
                      </TableCell>
                      <TableCell className="px-3 py-4 sm:px-6">
                        {project.end_date ? formatDate(project.end_date) : "-"}
                      </TableCell>
                      <TableCell className="px-3 py-4 sm:px-6">
                        {project.budget ? formatCurrency(project.budget) : "-"}
                      </TableCell>
                      <TableCell className="px-3 py-4 sm:px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvrir le menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onView(project.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(project.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setProjectToDelete(project.id)
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
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le projet et toutes les tâches
              associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <div className="text-red-600 text-sm mt-2">{deleteError}</div>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 