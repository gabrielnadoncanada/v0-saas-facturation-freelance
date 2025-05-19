import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProjectAction } from "@/features/project/delete/actions/deleteProject.action"
import { Project as BaseProject } from "@/features/project/shared/types/project.types"

// Extend Project type to include clients relation
export interface ProjectWithClient extends BaseProject {
  clients?: { name?: string }
}

export function useProjectsTable(projects: ProjectWithClient[]) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    setDeleteError(null)
    try {
      const result = await deleteProjectAction(projectToDelete)
      if (result.success) {
        router.refresh()
      } else {
        setDeleteError(result.error || "Une erreur est survenue lors de la suppression du projet")
      }
    } catch (error) {
      setDeleteError("Une erreur inattendue est survenue")
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  return {
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
    router,
  }
} 