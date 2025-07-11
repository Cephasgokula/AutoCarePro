import { supabase } from "./supabase-client"
import type { Service } from "./supabase"

export async function getServices(): Promise<{ services: Service[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("category", { ascending: true })
      .order("name", { ascending: true })

    if (error) {
      return { services: [], error: error.message }
    }

    return { services: data || [], error: null }
  } catch (error) {
    return { services: [], error: "Failed to fetch services" }
  }
}

export async function getServiceById(serviceId: string): Promise<{ service: Service | null; error: string | null }> {
  try {
    const { data, error } = await supabase.from("services").select("*").eq("id", serviceId).eq("active", true).single()

    if (error) {
      return { service: null, error: error.message }
    }

    return { service: data, error: null }
  } catch (error) {
    return { service: null, error: "Failed to fetch service" }
  }
}
