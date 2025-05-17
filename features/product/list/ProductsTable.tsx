"use client"

import { useProductsTable } from "./hooks/useProductsTable"
import { ProductsTableView } from "./ui/ProductsTableView"
import { Product } from "@/shared/types/products/product"

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
