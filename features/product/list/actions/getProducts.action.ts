'use server';

import { getProducts } from '@/features/product/list/model/getProducts';
import { Product } from '@/features/product/shared/types/product.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getProductsAction(): Promise<Result<Product[]>> {
  return withAction(async () => {
    const products = await getProducts();
    return products;
  });
}
