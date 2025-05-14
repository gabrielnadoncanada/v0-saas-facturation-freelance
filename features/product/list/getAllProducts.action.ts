'use server'

import { fetchAllProducts } from './fetchAllProducts'
import { Product } from '@/types/products/product'

export async function getAllProductsAction(): Promise<Product[]> {
  try {
    const products = await fetchAllProducts()
    return products
  } catch (error) {
    return { success: false, error: (error as Error).message, data: null }
  }
}
