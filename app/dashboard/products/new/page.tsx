import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductFormUI } from "@/components/features/products/product-form-ui"
import { redirect } from "next/navigation"

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) {
    redirect("/login")
  }

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
          <ProductFormUI userId={session.session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
