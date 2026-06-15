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
    .insert({
      ...lead,
      status: "Nuevo",
    })
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

export async function updateLeadStatus(id: number, status: string) {
  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating lead status:", error);
    return null;
  }

  return data as Lead;
}