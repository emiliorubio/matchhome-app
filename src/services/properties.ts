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
  typology: string;
  metro: string;
  address: string;
  project: string;
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
    console.error("Error creating property:", error);
    return null;
  }

  return data as Property;
}

export async function createPropertiesBulk(properties: NewProperty[]) {
  const { data, error } = await supabase
    .from("properties")
    .insert(properties)
    .select();

  if (error) {
    console.error("Error bulk creating properties:", error);
    return null;
  }

  return data as Property[];
}

export async function updateProperty(
  id: number,
  property: NewProperty
) {
  const { data, error } = await supabase
    .from("properties")
    .update(property)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating property:", error);
    return null;
  }

  return data as Property;
}

export async function deleteProperty(id: number) {
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting property:", error);
    return false;
  }

  return true;
}