'use server';

import { getCategories } from '@/features/category/list/model/getCategories';
import { Category } from '@/features/category/shared/types/category.types';
import { Result } from '@/shared/utils/result';
import { withAction } from '@/shared/utils/withAction';

export async function getCategoriesAction(): Promise<Result<Category[]>> {
  return withAction(async () => {
    const categories = await getCategories();
    return categories;
  });
}
