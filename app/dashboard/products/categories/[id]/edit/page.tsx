import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryFormUI } from "@/components/features/products/category-form-ui"
import { redirect, notFound } from "next/navigation"
import { getCategory, createCategory, updateCategory } from "@/app/actions/categories"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) {
    redirect("/login")
  }

  // Fetch the category
  const { data: category, error } = await getCategory(params.id)

  if (error || !category) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier la catégorie</h1>
        <p className="text-muted-foreground">Mettez à jour les informations de votre catégorie</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryFormUI
            userId={session.session.user.id}
            category={category}
            createCategoryAction={createCategory}
            updateCategoryAction={updateCategory}
          />
        </CardContent>
      </Card>
    </div>
  )
}
