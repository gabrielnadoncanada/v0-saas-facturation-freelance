import { getSessionUser } from '@/shared/utils/getSessionUser';
import { Product } from '@/features/product/shared/types/product.types';
import { fetchList } from '@/shared/services/supabase/crud';

export async function getProducts(): Promise<Product[]> {
  const { supabase, organization } = await getSessionUser();

  if (!organization) {
    return [];
  }

  return await fetchList<Product>(
    supabase,
    'products',
    '*, category:category_id(id, name, color)',
    { organization_id: organization.id },
    { column: 'created_at', ascending: false },
  );
}
