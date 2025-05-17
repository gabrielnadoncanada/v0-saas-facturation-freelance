import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteCategoryAction } from "@/features/category/delete/actions/deleteCategory.action"

export function useCategoryTableActions() {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteCategoryAction(deleteId)
      if (result.error) {
        console.error("Error deleting category:", result.error)
        // Implement proper error handling/notification here
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return {
    deleteId,
    setDeleteId,
    isDeleting,
    handleDelete,
  }
} 