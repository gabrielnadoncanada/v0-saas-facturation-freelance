import { Product } from '@/features/product/shared/types/product.types';
import { getSessionUser } from '@/shared/utils/getSessionUser';
import { deleteRecord } from '@/shared/services/supabase/crud';

export async function deleteProduct(productId: string): Promise<Product> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  return await deleteRecord<Product>(supabase, 'products', productId, '*', {
    organization_id: organization.id,
  });
}
