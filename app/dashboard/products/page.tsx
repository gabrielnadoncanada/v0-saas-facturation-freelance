import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/features/product/list/ui/ProductsTable"
import { getProductsAction } from "@/features/product/list/actions/getProducts.action"
import { getCategoriesAction } from "@/features/category/list/actions/getCategories.action"
import { redirect } from "next/navigation"

export default async function ProductsPage() {
  const result = await getProductsAction()
  const categoriesResult = await getCategoriesAction()

  if (!result.success || !categoriesResult.success) {
    redirect("/login")
  }

  const categoriesCount = categoriesResult.data?.length || 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits et Services</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services pour une facturation plus rapide
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/products/categories">
            <Button variant="outline">
              Gérer les catégories
              {categoriesCount > 0 && (
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {categoriesCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/dashboard/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Button>
          </Link>
        </div>
      </div>

      <ProductsTable products={result.data} />
    </div>
  )
}
