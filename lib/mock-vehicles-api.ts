import { mockVehicles, type Vehicle } from "./mock-data"

// Mock implementation of vehicle API functions
export async function getVehicles(userId: string): Promise<{ vehicles: Vehicle[]; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Filter vehicles by user (in mock data all belong to user-1)
  const userVehicles = mockVehicles.filter(vehicle => vehicle.user_id === userId)
  
  return { vehicles: userVehicles, error: null }
}

export async function addVehicle(
  userId: string,
  vehicle: Omit<Vehicle, "id" | "user_id" | "created_at" | "updated_at">,
): Promise<{ vehicle: Vehicle | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Create new vehicle with mock ID
  const newVehicle: Vehicle = {
    id: `vehicle-${Date.now()}`,
    user_id: userId,
    ...vehicle,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  // In a real app, this would save to the database
  // For demo purposes, we just return the new vehicle
  return { vehicle: newVehicle, error: null }
}

export async function updateVehicle(
  vehicleId: string,
  updates: Partial<Omit<Vehicle, "id" | "user_id" | "created_at" | "updated_at">>,
): Promise<{ vehicle: Vehicle | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Find the vehicle to update
  const existingVehicle = mockVehicles.find(v => v.id === vehicleId)
  
  if (!existingVehicle) {
    return { vehicle: null, error: "Vehicle not found" }
  }
  
  // Create updated vehicle
  const updatedVehicle: Vehicle = {
    ...existingVehicle,
    ...updates,
    updated_at: new Date().toISOString()
  }
  
  return { vehicle: updatedVehicle, error: null }
}

export async function deleteVehicle(vehicleId: string): Promise<{ success: boolean; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Check if vehicle exists
  const vehicleExists = mockVehicles.some(v => v.id === vehicleId)
  
  if (!vehicleExists) {
    return { success: false, error: "Vehicle not found" }
  }
  
  // In a real app, this would delete from the database
  return { success: true, error: null }
}

// Export types for compatibility
export type { Vehicle } from "./mock-data"