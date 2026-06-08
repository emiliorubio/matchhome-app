import { supabase } from "@/src/lib/supabase";

export type NewLead = {
  property_title: string;
  property_location: string;
  property_price: string;
  name: string;
  phone: string;
  income: string;
  message: string;
};

export async function createLead(lead: NewLead) {
  const { data, error } = await supabase
    .from("leads")
    .insert(lead)
    .select()
    .single();

  if (error) {
    console.error("Error creating lead:", error);
    return null;
  }

  return data;
}