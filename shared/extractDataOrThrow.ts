import type { PostgrestSingleResponse } from '@supabase/supabase-js'

export function extractDataOrThrow<T>(res: PostgrestSingleResponse<T>): T {
  if (res.error) throw new Error(res.error.message)
  return res.data
}
