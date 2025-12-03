import { supabase } from "@/lib/supabaseClient";

export async function fetchFirIds() {
  if (!supabase) {
    console.error("Supabase client is not initialized.");
    return [];
  }
  const { data, error } = await supabase
    .from("fir")
    .select("fir_id")
    .order("fir_id", { ascending: false });
  if (error) {
    console.error("Error fetching FIR IDs:", error);
    return [];
  }
  return data ? data.map((row) => row.fir_id) : [];
}
