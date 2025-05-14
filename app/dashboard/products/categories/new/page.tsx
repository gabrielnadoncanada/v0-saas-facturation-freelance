import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryFormUI } from "@/components/products/category-form-ui"
import { redirect } from "next/navigation"
import { createCategoryAction } from "@/actions/categories/create"

export default async function NewCategoryPage() {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle catégorie</h1>
        <p className="text-muted-foreground">Ajoutez une nouvelle catégorie pour vos produits et services</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryFormUI userId={session.session.user.id} createCategoryAction={createCategoryAction} />
        </CardContent>
      </Card>
    </div>
  )
}
