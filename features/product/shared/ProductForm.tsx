"use client"

import { Product } from "@/shared/types/products/product"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryForm } from "../../category/shared/CategoryForm"
import { useCategories } from "@/shared/hooks/use-categories"
import { createProductAction } from "@/features/product/create/actions/createProduct.action"
import { updateProductAction } from "@/features/product/edit/actions/updateProduct.action"
import { useState } from "react"
import { useProductForm } from "./hooks/useProductForm"
import { ProductFormView } from "./ui/ProductFormView"

export function ProductForm({ product }: { product: Product | null }) {
  const router = useRouter()
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const { categories, isLoading: isLoadingCategories, refetch: refetchCategories } = useCategories()

  const {
    form,
    isLoading,
    error,
    setError,
    onSubmit,
  } = useProductForm({
    product,
    createProductAction,
    updateProductAction,
    onSubmitSuccess: () => {
      router.push("/dashboard/products")
      router.refresh()
    },
  })

  const handleCategorySuccess = async (categoryId: string | null) => {
    setIsCategoryModalOpen(false)
    await refetchCategories?.()
    if (categoryId) {
      form.setValue("category_id", categoryId)
    }
  }

  return (
    <>
      <ProductFormView
        form={form}
        isLoading={isLoading}
        error={error}
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        onSubmit={onSubmit}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
      />

      {/* Modal for adding a new category */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <CategoryForm isModal={true} onSuccess={handleCategorySuccess} />
        </DialogContent>
      </Dialog>
    </>
  )
}
