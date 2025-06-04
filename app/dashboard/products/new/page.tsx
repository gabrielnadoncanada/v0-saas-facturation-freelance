import { ProductForm } from '@/features/product/shared/ui/ProductForm';
import FormPageLayout from '@/components/layout/FormPageLayout';

export default async function NewProductPage() {
  return (
    <FormPageLayout
      title="Nouveau produit"
      subtitle="Ajoutez un nouveau produit ou service à votre catalogue"
      backHref="/dashboard/products"
    >
      <ProductForm product={null} />
    </FormPageLayout>
  );
}
