'use server';

import { getProduct } from '@/features/product/shared/model/getProduct';
import { Product } from '@/features/product/shared/types/product.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getProductAction(productId: string): Promise<Result<Product>> {
  return withAction(async () => {
    const product = await getProduct(productId);
    return product;
  });
}
