import { createClient } from "./supabase/client";
import { Tables } from "@/types/database.types";

export async function getNonogram(
  id: string,
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
  id: string,
): Promise<{ rows: number[][]; columns: number[][] }> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("nonogram_hints")
      .select("*")
      .eq("nonogram_id", id);
    if (error) {
      throw new Error(error.message);
      return { rows: [], columns: [] };
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

export async function getAllPacks(): Promise<Tables<"packs">[]> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("packs").select("*");
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
