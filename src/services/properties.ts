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

  unit_number: string;

  featured: boolean;

  description: string;

  photos: string;
  cover_photo: string;

  promotion: string;

  guarantee_installments: boolean;

  internal_notes: string;

  status: string;
};

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("featured", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.error("Error loading properties:", error);
    return [];
  }

  return data ?? [];
}

export async function getPropertyById(id: number): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error loading property:", error);
    return null;
  }

  return data as Property;
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

export async function updateProperty(id: number, property: NewProperty) {
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

export async function uploadPropertyPhotos(files: File[]) {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileExtension = file.name.split(".").pop() || "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExtension}`;

    const filePath = `properties/${fileName}`;

    const { error } = await supabase.storage
      .from("property-photos")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading photo:", error);
      continue;
    }

    const { data } = supabase.storage
      .from("property-photos").getPublicUrl(filePath);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
}