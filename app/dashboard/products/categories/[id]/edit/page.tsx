import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryForm } from "@/features/category/shared/CategoryForm"
import { redirect, notFound } from "next/navigation"
import { getCategoryAction } from "@/features/category/shared/actions/getCategory.action"
import { Category } from "@/shared/types/categories/category"
interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const result = await getCategoryAction(params.id)

  if (!result.success) {
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
          <CategoryForm
            category={result.data as Category}
          />
        </CardContent>
      </Card>
    </div>
  )
}
