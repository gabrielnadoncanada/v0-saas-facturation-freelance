import { ProductForm } from "@/features/product/shared/ui/ProductForm"
import { notFound } from "next/navigation"
import { getProductAction } from "@/features/product/shared/actions/getProduct.action"
import FormPageLayout from "@/components/layout/FormPageLayout"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const result = await getProductAction(params.id)

  if (!result.success) {
    notFound()
  }

  return (
    <FormPageLayout
      title="Modifier le produit"
      subtitle="Mettez à jour les informations de votre produit ou service"
      backHref="/dashboard/products"
    >
      <ProductForm product={result.data} />
    </FormPageLayout>
  )
}
