import { supabase } from "@/src/lib/supabase";

import { Property } from "@/src/types/property";

export async function getProperties(): Promise<Property[]> {

  const { data, error } = await supabase
    .from("properties")
    .select("*");

  if (error) {

    console.error(error);

    return [];

  }

  return data as Property[];

}