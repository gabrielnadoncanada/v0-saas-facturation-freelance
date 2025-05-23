import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProjectAction } from "@/features/project/delete/actions/deleteProject.action"
import { Project as BaseProject } from "@/features/project/shared/types/project.types"

export interface ProjectWithClient extends BaseProject {
  clients?: { name?: string }
}

export function useProjectsTable() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)


  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const result = await deleteProjectAction(id)
      if (!result.success) {
        console.error("Error deleting project:", result.error)
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    handleDelete,
    router,
  }
} 