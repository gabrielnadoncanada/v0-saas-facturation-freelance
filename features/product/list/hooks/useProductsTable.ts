import { useState } from "react"
import { deleteProductAction } from "@/features/product/shared/actions/deleteProduct.action"
import { useRouter } from "next/navigation"

export function useProductsTable() {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const result = await deleteProductAction(deleteId)
      if (result.error) {
        console.error("Error deleting product:", result.error)
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
    router,
  }
} 