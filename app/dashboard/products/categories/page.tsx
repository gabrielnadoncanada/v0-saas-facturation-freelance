import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CategoriesTableUI } from "@/components/products/categories-table-ui"
import { getAllCategoriesAction } from "@/features/category/list/getAllCategories.action"

export default async function CategoriesPage() {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) {
    redirect("/login")
  }

  // Fetch categories
  const result = await getAllCategoriesAction()

  if (!result.success) {
    console.error("Error fetching categories:", result.error)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">Gérez les catégories pour organiser vos produits et services</p>
        </div>
        <Link href="/dashboard/products/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </Link>
      </div>

      <CategoriesTableUI categories={result.data!.categories as Category[]} />
    </div>
  )
}
