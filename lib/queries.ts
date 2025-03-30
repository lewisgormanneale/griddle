import { createClient } from "@/utils/supabase/client";
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
