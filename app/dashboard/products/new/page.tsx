import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/features/product/shared/ui/ProductForm"

export default async function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouveau produit</h1>
        <p className="text-muted-foreground">Ajoutez un nouveau produit ou service à votre catalogue</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm product={null} />
        </CardContent>
      </Card>
    </div>
  )
}
