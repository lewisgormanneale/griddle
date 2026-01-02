import type { Tables } from '@/types/database.types';
import type { NonogramWithProfile, PackWithProfile } from '@/utils/supabase/queries';
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

export async function getProfileByUsername(
  username: string
): Promise<Tables<'profiles'> | undefined> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', username)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as Tables<'profiles'> | undefined;
  } catch (error) {
    logError('Failed to load profile by username', error);
    return undefined;
  }
}

export async function getPacksForUserServer(userId: string): Promise<PackWithProfile[]> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('packs')
      .select('*, profiles(username)')
      .eq('user_id', userId)
      .order('id');

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as PackWithProfile[];
  } catch (error) {
    logError('Failed to load packs for user', error);
    return [];
  }
}

type CompletionWithPack = Tables<'completed_nonograms'> & {
  nonograms: { pack_id: number | null } | { pack_id: number | null }[] | null;
};

export async function getUserStats(userId: string): Promise<{
  totalSolved: number;
  completedPacks: number;
}> {
  const supabase = await createClient();
  try {
    const { data, count, error } = await supabase
      .from('completed_nonograms')
      .select('nonogram_id, nonograms(pack_id)', { count: 'exact' })
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    const packIds = new Set<number>();
    const completions = (data ?? []) as CompletionWithPack[];
    completions.forEach((item) => {
      const rel = item.nonograms;
      if (Array.isArray(rel)) {
        rel.forEach((n) => {
          if (n?.pack_id !== null && n?.pack_id !== undefined) {
            packIds.add(n.pack_id);
          }
        });
      } else if (rel?.pack_id !== null && rel?.pack_id !== undefined) {
        packIds.add(rel.pack_id);
      }
    });

    return {
      totalSolved: count ?? 0,
      completedPacks: packIds.size,
    };
  } catch (error) {
    logError('Failed to load user stats', error);
    return { totalSolved: 0, completedPacks: 0 };
  }
}
