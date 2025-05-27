import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/database.types";

export async function getNonogram(
  id: number,
): Promise<Tables<"nonograms"> | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("nonograms")
      .select("*")
      .eq("id", id)
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

export async function getAllNonograms(): Promise<Tables<"nonograms">[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("nonograms").select("*");
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
  id: number,
): Promise<{ rows: number[][]; columns: number[][] }> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("nonogram_hints")
      .select("*")
      .eq("nonogram_id", id);
    if (error) {
      throw new Error(error.message);
    }
    const rows = data
      .filter((item) => item.direction === "row")
      .sort((a, b) => a.index - b.index)
      .map((item) => item.hints);

    const columns = data
      .filter((item) => item.direction === "column")
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
  nonogram_id: number,
): Promise<Tables<"completed_nonograms"> | undefined> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("completed_nonograms")
      .select("*")
      .eq("user_id", user_id)
      .eq("nonogram_id", nonogram_id)
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

export type CompletedNonogramWithProfile = Tables<"completed_nonograms"> & {
  profiles: Tables<"profiles">;
};

export async function getTopNonogramCompletions(
  nonogram_id: number,
): Promise<CompletedNonogramWithProfile[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("completed_nonograms")
    .select("*, profiles(*)")
    .eq("nonogram_id", nonogram_id)
    .order("completion_time", { ascending: true })
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
    const { data, error } = await supabase.from("completed_nonograms").upsert(
      {
        user_id,
        nonogram_id,
        completion_time,
      },
      {
        onConflict: "user_id,nonogram_id",
      },
    );

    if (error) throw new Error(error.message);
    return data;
  } catch (error) {
    console.error("Failed to save completion", error);
  }
}

export async function getAllPacks(): Promise<Tables<"packs">[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("packs")
      .select("*")
      .order("id");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getNonogramsForPack(
  id: number,
): Promise<Tables<"nonograms">[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("nonograms")
      .select("*")
      .eq("pack_id", id);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
