import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Product } from '@/features/product/shared/types/product.types';
import { fetchById } from '@/shared/services/supabase/crud';

export async function getProduct(productId: string): Promise<Product> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    throw new Error('Aucune organisation active');
  }

  return await fetchById<Product>(supabase, 'products', productId, '*', {
    organization_id: organization.id,
  });
}
