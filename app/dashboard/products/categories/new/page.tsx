import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoryForm } from "@/features/category/shared/CategoryForm"

export default async function NewCategoryPage() {

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
          <CategoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
