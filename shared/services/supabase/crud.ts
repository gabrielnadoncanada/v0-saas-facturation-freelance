import type { SupabaseClient } from '@supabase/supabase-js';

export async function fetchById<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select = '*',
  filters: Record<string, any> = {},
): Promise<T> {
  let query: any = supabase.from(table).select(select).eq('id', id);
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any);
  }
  const { data, error } = await query.single();
  if (error) throw new Error(error.message);
  return data as T;
}

export async function fetchList<T>(
  supabase: SupabaseClient,
  table: string,
  select = '*',
  filters: Record<string, any> = {},
  sort: { column: string; ascending: boolean } | null = null,
  pagination: { page: number; pageSize: number } | null = null,
): Promise<T[]> {
  let query = supabase.from(table).select(select);

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      query = query.in(key, value);
    } else if (value === null) {
      query = query.is(key, null);
    } else {
      query = query.eq(key, value);
    }
  }

  // Apply sorting
  if (sort) {
    query = query.order(sort.column, {
      ascending: sort.ascending,
    });
  }

  // Apply pagination
  if (pagination) {
    const { page, pageSize } = pagination;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data as T[];
}

export async function fetchOne<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select = '*',
  additionalFilters: Record<string, any> = {},
): Promise<T | null> {
  let query = supabase.from(table).select(select).eq('id', id);

  // Apply additional filters (useful for organization_id filtering)
  for (const [key, value] of Object.entries(additionalFilters)) {
    query = query.eq(key, value);
  }

  const { data, error } = await query.single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows returned
    throw new Error(error.message);
  }

  return data as T;
}

export async function countRecords(
  supabase: SupabaseClient,
  table: string,
  filters: Record<string, any> = {},
): Promise<number> {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any);
  }
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function batchUpdate<T>(
  supabase: SupabaseClient,
  table: string,
  values: Partial<T>,
  filters: Record<string, any>,
): Promise<void> {
  let query = supabase.from(table).update(values);
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any);
  }
  const { error } = await query;
  if (error) throw new Error(error.message);
}

export async function batchDelete(
  supabase: SupabaseClient,
  table: string,
  ids: string[],
): Promise<void> {
  if (ids.length === 0) return;

  const { error } = await supabase.from(table).delete().in('id', ids);

  if (error) throw new Error(error.message);
}

export async function bulkInsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: Partial<T>[],
  select = '*',
): Promise<T[]> {
  if (records.length === 0) return [];

  const { data, error } = await supabase.from(table).insert(records).select(select);

  if (error) throw new Error(error.message);
  return data as T[];
}

export async function bulkUpsert<T>(
  supabase: SupabaseClient,
  table: string,
  records: Partial<T>[],
  select = '*',
): Promise<T[]> {
  if (records.length === 0) return [];

  const { data, error } = await supabase.from(table).upsert(records).select(select);

  if (error) throw new Error(error.message);
  return data as T[];
}

export async function insertRecord<T>(
  supabase: SupabaseClient,
  table: string,
  values: Partial<T>,
  select = '*',
  returnSingle = true,
): Promise<T> {
  const query = supabase.from(table).insert(values).select(select);

  if (returnSingle) {
    const { data, error } = await query.single();
    if (error) throw new Error(error.message);
    return data as T;
  } else {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data[0] as T;
  }
}

export async function updateRecord<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  values: Partial<T>,
  select = '*',
  filters: Record<string, any> = {},
): Promise<T> {
  let query = supabase.from(table).update(values).eq('id', id);

  // Apply additional filters
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any);
  }

  const { data, error } = await query.select(select).single();
  if (error) throw new Error(error.message);
  return data as T;
}

export async function deleteRecord<T>(
  supabase: SupabaseClient,
  table: string,
  id: string,
  select = '*',
  filters: Record<string, any> = {},
): Promise<T> {
  let query: any = supabase.from(table).delete().eq('id', id);
  for (const [key, value] of Object.entries(filters)) {
    query = query.eq(key, value as any);
  }
  const { data, error } = await query.select(select).single();
  if (error) throw new Error(error.message);
  return data as T;
}

export async function count(
  supabase: SupabaseClient,
  table: string,
  filters: Record<string, any> = {},
): Promise<number> {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });

  // Apply filters
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      query = query.in(key, value);
    } else if (value === null) {
      query = query.is(key, null);
    } else {
      query = query.eq(key, value);
    }
  }

  const { count, error } = await query;

  if (error) throw new Error(error.message);
  return count ?? 0;
}
