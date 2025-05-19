"use client"

import { useProductsTable } from "@/features/product/list/hooks/useProductsTable"
import { ProductsTableView } from "@/features/product/list/ui/ProductsTableView"
import { Product } from "@/features/product/shared/types/product.types"

export function ProductsTable({ products }: { products: Product[] }) {
  const {
    deleteId,
    setDeleteId,
    isDeleting,
    handleDelete,
    router,
  } = useProductsTable()

  return (
    <ProductsTableView
      products={products}
      deleteId={deleteId}
      setDeleteId={setDeleteId}
      isDeleting={isDeleting}
      handleDelete={handleDelete}
      router={router}
    />
  )
}
