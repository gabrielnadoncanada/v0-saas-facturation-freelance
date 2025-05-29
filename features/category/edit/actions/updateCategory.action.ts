'use server'

import { updateCategory } from '@/features/category/edit/model/updateCategory'
import { CategoryFormData } from '@/features/category/shared/types/category.types'
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateCategoryAction(
  categoryId: string,
  data: CategoryFormData
): Promise<Result<null>> {
  return withAction(async () => {
    await updateCategory(categoryId, data)
    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    redirect("/dashboard/products/categories")
    return null
  })
}
