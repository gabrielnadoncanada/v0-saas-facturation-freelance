import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/features/product/shared/ui/ProductForm"
import { notFound } from "next/navigation"
import { getProductAction } from "@/features/product/shared/actions/getProduct.action"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const result = await getProductAction(params.id)

  if (!result.success) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier le produit</h1>
        <p className="text-muted-foreground">Mettez à jour les informations de votre produit ou service</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails du produit</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm product={result.data} />
        </CardContent>
      </Card>
    </div>
  )
}
