import type { NonogramWithProfile } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { logError } from '@/utils/logger';

export async function getNonogramServer(id: number): Promise<NonogramWithProfile | undefined> {
  const supabase = await createClient();
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
    logError('Failed to load nonogram (server)', error);
    return undefined;
  }
}

export async function getNonogramHintsServer(
  id: number
): Promise<{ rows: number[][]; columns: number[][] }> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('nonogram_hints').select('*').eq('nonogram_id', id);
    if (error) {
      throw new Error(error.message);
    }
    const rows = (data ?? [])
      .filter((item) => item.direction === 'row')
      .sort((a, b) => a.index - b.index)
      .map((item) => item.hints);

    const columns = (data ?? [])
      .filter((item) => item.direction === 'column')
      .sort((a, b) => a.index - b.index)
      .map((item) => item.hints);

    return { rows, columns };
  } catch (error) {
    logError('Failed to load nonogram hints (server)', error);
    return { rows: [], columns: [] };
  }
}
