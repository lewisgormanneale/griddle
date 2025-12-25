import { Tables } from '@/types/database.types';
import { createClient } from '@/utils/supabase/client';

export type PackWithProfile = Tables<'packs'> & {
  profiles: Pick<Tables<'profiles'>, 'username'> | null;
};

export type NonogramWithProfile = Tables<'nonograms'> & {
  profiles: Pick<Tables<'profiles'>, 'username'> | null;
};

export async function getNonogram(
  id: number
): Promise<NonogramWithProfile | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('nonograms')
      .select('*, profiles(username)')
      .eq('id', id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data as NonogramWithProfile;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function getAllNonograms(): Promise<Tables<'nonograms'>[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('nonograms').select('*');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getNonogramHints(
  id: number
): Promise<{ rows: number[][]; columns: number[][] }> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('nonogram_hints').select('*').eq('nonogram_id', id);
    if (error) {
      throw new Error(error.message);
    }
    const rows = data
      .filter((item) => item.direction === 'row')
      .sort((a, b) => a.index - b.index)
      .map((item) => item.hints);

    const columns = data
      .filter((item) => item.direction === 'column')
      .sort((a, b) => a.index - b.index)
      .map((item) => item.hints);

    return { rows, columns };
  } catch (error) {
    console.error(error);
    return { rows: [], columns: [] };
  }
}

export async function getUserCompletionOfNonogram(
  user_id: string,
  nonogram_id: number
): Promise<Tables<'completed_nonograms'> | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('completed_nonograms')
      .select('*')
      .eq('user_id', user_id)
      .eq('nonogram_id', nonogram_id)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export type CompletedNonogramWithProfile = Tables<'completed_nonograms'> & {
  profiles: Tables<'profiles'>;
};

export async function getTopNonogramCompletions(
  nonogram_id: number
): Promise<CompletedNonogramWithProfile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('completed_nonograms')
    .select('*, profiles(*)')
    .eq('nonogram_id', nonogram_id)
    .order('completion_time', { ascending: true })
    .limit(10);

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data as CompletedNonogramWithProfile[];
}

export async function saveNonogramCompletion({
  user_id,
  nonogram_id,
  completion_time,
}: {
  user_id: string;
  nonogram_id: number;
  completion_time: number; // in seconds
}) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('completed_nonograms').upsert(
      {
        user_id,
        nonogram_id,
        completion_time,
      },
      {
        onConflict: 'user_id,nonogram_id',
      }
    );

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error('Failed to save completion', error);
  }
}

export async function getAllPacks(): Promise<Tables<'packs'>[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('packs').select('*').order('id');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPacks({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<{ data: PackWithProfile[]; count: number }> {
  const supabase = createClient();
  const from = Math.max(0, (page - 1) * pageSize);
  const to = from + Math.max(1, pageSize) - 1;

  try {
    const { data, error, count } = await supabase
      .from('packs')
      .select('*, profiles(username)', { count: 'exact' })
      .order('id')
      .range(from, to);
    if (error) {
      throw new Error(error.message);
    }
    return { data: (data ?? []) as PackWithProfile[], count: count ?? 0 };
  } catch (error) {
    console.error(error);
    return { data: [], count: 0 };
  }
}

export async function getNonogramsForPack(id: number): Promise<NonogramWithProfile[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('nonograms')
      .select('*, profiles(username)')
      .eq('pack_id', id);
    if (error) {
      throw new Error(error.message);
    }
    return data as NonogramWithProfile[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createPack({
  name,
  description,
  userId,
}: {
  name: string;
  description?: string;
  userId: string;
}): Promise<Tables<'packs'> | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('packs')
      .insert({
        name,
        description: description ?? null,
        user_id: userId,
      } as any)
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function createNonogram({
  title,
  width,
  height,
  solution,
  packId,
  userId,
}: {
  title: string;
  width: number;
  height: number;
  solution: string;
  packId: number | null;
  userId: string;
}): Promise<Tables<'nonograms'> | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('nonograms')
      .insert({
        title,
        width,
        height,
        solution,
        pack_id: packId,
        user_id: userId,
      } as any)
      .select('*')
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function createNonogramHints({
  nonogramId,
  rows,
  columns,
}: {
  nonogramId: number;
  rows: number[][];
  columns: number[][];
}): Promise<boolean> {
  const supabase = createClient();
  const rowHints = rows.map((hints, index) => ({
    nonogram_id: nonogramId,
    direction: 'row',
    index,
    hints,
  }));
  const columnHints = columns.map((hints, index) => ({
    nonogram_id: nonogramId,
    direction: 'column',
    index,
    hints,
  }));

  try {
    const { error } = await supabase
      .from('nonogram_hints')
      .insert([...rowHints, ...columnHints]);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getPacksForUser(userId: string): Promise<Tables<'packs'>[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('packs')
      .select('*')
      .eq('user_id', userId)
      .order('id');
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
