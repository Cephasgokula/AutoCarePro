import { supabase } from "./supabase-client"
import type { Vehicle } from "./supabase"

export async function getVehicles(userId: string): Promise<{ vehicles: Vehicle[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      return { vehicles: [], error: error.message }
    }

    return { vehicles: data || [], error: null }
  } catch (error) {
    return { vehicles: [], error: "Failed to fetch vehicles" }
  }
}

export async function addVehicle(
  userId: string,
  vehicle: Omit<Vehicle, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<{ vehicle: Vehicle | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .insert([
        {
          user_id: userId,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          license_plate: vehicle.license_plate,
          color: vehicle.color,
        },
      ])
      .select("*")
      .single()

    if (error) {
      return { vehicle: null, error: error.message }
    }

    return { vehicle: data, error: null }
  } catch (error) {
    return { vehicle: null, error: "Failed to add vehicle" }
  }
}

export async function updateVehicle(
  vehicleId: string,
  updates: Partial<Omit<Vehicle, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<{ vehicle: Vehicle | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", vehicleId)
      .select("*")
      .single()

    if (error) {
      return { vehicle: null, error: error.message }
    }

    return { vehicle: data, error: null }
  } catch (error) {
    return { vehicle: null, error: "Failed to update vehicle" }
  }
}

export async function deleteVehicle(vehicleId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: "Failed to delete vehicle" }
  }
}
