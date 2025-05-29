import type { SupabaseClient } from '@supabase/supabase-js'

export async function fetchById<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select = '*',
  filters: Record<string, any> = {}
): Promise<T> {
  let query: any = supabase.from(table).select(select).eq('id', id)
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any)
  }
  const { data, error } = await query.single()
  if (error) throw new Error(error.message)
  return data as T
}

export async function insertRecord<T>(
  supabase: SupabaseClient,
  table: string,
  values: Partial<T>,
  select = '*'
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select(select)
    .single()
  if (error) throw new Error(error.message)
  return data as T
}

export async function updateRecord<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  values: Partial<T>,
  select = '*',
  filters: Record<string, any> = {}
): Promise<T> {
  let query: any = supabase.from(table).update(values).eq('id', id)
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any)
  }
  const { data, error } = await query.select(select).single()
  if (error) throw new Error(error.message)
  return data as T
}

export async function deleteRecord<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select = '*',
  filters: Record<string, any> = {}
): Promise<T> {
  let query: any = supabase.from(table).delete().eq('id', id)
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any)
  }
  const { data, error } = await query.select(select).single()
  if (error) throw new Error(error.message)
  return data as T
}
