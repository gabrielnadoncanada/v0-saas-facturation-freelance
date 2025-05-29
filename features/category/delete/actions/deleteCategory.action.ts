"use server"

import { deleteCategory } from '@/features/category/delete/model/deleteCategory'
import { revalidatePath } from "next/cache"
import { Result } from '@/shared/utils/result'
import { withAction } from '@/shared/utils/withAction'

export async function deleteCategoryAction(categoryId: string): Promise<Result<null>> {
  return withAction(async () => {
    await deleteCategory(categoryId)
    revalidatePath("/dashboard/products/categories")
    revalidatePath("/dashboard/products")
    return null
  })
}
