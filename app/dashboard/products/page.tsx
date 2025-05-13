import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/features/products/products-table"
import { getProducts, getCategories } from "@/app/actions/products"
import { createClient } from "@/lib/supabase/server"

export default async function ProductsPage() {
  const supabase = createClient()

  const { data: session } = await supabase.auth.getSession()
  if (!session.session) {
    redirect("/login")
  }

  // Fetch products with categories
  const { data: products, error } = await getProducts()

  if (error) {
    console.error("Error fetching products:", error)
  }

  // Fetch categories count
  const { data: categoriesData } = await getCategories()
  const categoriesCount = categoriesData?.length || 0

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

      <ProductsTableUI products={products || []} />
    </div>
  )
}
