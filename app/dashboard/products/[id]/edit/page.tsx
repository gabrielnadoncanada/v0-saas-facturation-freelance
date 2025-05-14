import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductFormUI } from "@/components/products/product-form-ui"
import { redirect, notFound } from "next/navigation"
import { getProductAction } from "@/actions/products/get"

interface EditProductPageProps {
    params: { 
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) {
    redirect("/login")
  }

  // Fetch the product
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
          <ProductFormUI userId={session.session.user.id} product={result.data!.product} />
        </CardContent>
      </Card>
    </div>
  )
}
