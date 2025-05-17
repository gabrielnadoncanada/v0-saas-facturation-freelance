'use server'

import { fetchAllProducts } from '../model/fetchAllProducts'
import { Product } from '@/shared/types/products/product'

export async function getAllProductsAction(): Promise<Product[]> {
  return await fetchAllProducts()
}
