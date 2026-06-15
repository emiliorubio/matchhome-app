import { supabase } from "@/src/lib/supabase";
import { Lead } from "@/src/types/lead";

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

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading leads:", error);
    return [];
  }

  return data ?? [];
}