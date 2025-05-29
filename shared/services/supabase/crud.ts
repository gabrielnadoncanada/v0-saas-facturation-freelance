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

export async function fetchList<T>(
  supabase: SupabaseClient,
  table: string,
  select = '*',
  filters: Record<string, any> = {},
  orderBy?: { column: string; ascending?: boolean },
  limit?: number
): Promise<T[]> {
  let query: any = supabase.from(table).select(select)
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any)
  }
  if (orderBy) {
    query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true })
  }
  if (limit !== undefined) {
    query = query.limit(limit)
  }
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as T[]
}

export async function countRecords(
  supabase: SupabaseClient,
  table: string,
  filters: Record<string, any> = {}
): Promise<number> {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any)
  }
  const { count, error } = await query
  if (error) throw new Error(error.message)
  return count ?? 0
}

export async function batchUpdate<T>(
  supabase: SupabaseClient,
  table: string,
  values: Partial<T>,
  filters: Record<string, any>
): Promise<void> {
  let query = supabase.from(table).update(values)
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any)
  }
  const { error } = await query
  if (error) throw new Error(error.message)
}

export async function batchDelete(
  supabase: SupabaseClient,
  table: string,
  ids: string[]
): Promise<void> {
  if (ids.length === 0) return
  
  const { error } = await supabase
    .from(table)
    .delete()
    .in('id', ids)
  
  if (error) throw new Error(error.message)
}

export async function bulkInsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: Partial<T>[],
  select = '*'
): Promise<T[]> {
  if (records.length === 0) return []
  
  const { data, error } = await supabase
    .from(table)
    .insert(records)
    .select(select)
  
  if (error) throw new Error(error.message)
  return data as T[]
}

export async function bulkUpsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: Partial<T>[],
  select = '*'
): Promise<T[]> {
  if (records.length === 0) return []
  
  const { data, error } = await supabase
    .from(table)
    .upsert(records)
    .select(select)
  
  if (error) throw new Error(error.message)
  return data as T[]
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
