import { supabase } from "@/src/lib/supabase";

export async function getProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*");

  console.log("PROPERTIES:", data);
  console.log("ERROR:", error);

  if (error) {
    return [];
  }

  return data ?? [];
}