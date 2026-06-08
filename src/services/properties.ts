import { supabase } from "@/src/lib/supabase";
import { Property } from "@/src/types/property";

export type NewProperty = {
  title: string;
  location: string;
  price: number;
  match: number;
  gradient: string;
  budget: string;
  pets: boolean;
  parking: boolean;
};

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error loading properties:", error);
    return [];
  }

  return data ?? [];
}

export async function createProperty(property: NewProperty) {
  const { data, error } = await supabase
    .from("properties")
    .insert(property)
    .select()
    .single();

  if (error) {
  console.log("ERROR COMPLETO:", JSON.stringify(error));
  console.error(error);

  return null;
  }

  return data as Property;
}