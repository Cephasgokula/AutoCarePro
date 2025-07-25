import { mockServices, type Service } from "./mock-data"

export async function getServices(): Promise<{ services: Service[]; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Return all active services sorted by category and name
  const activeServices = mockServices
    .filter(service => service.active)
    .sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      return a.name.localeCompare(b.name)
    })
  
  return { services: activeServices, error: null }
}

export async function getServiceById(serviceId: string): Promise<{ service: Service | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200))
  
  const service = mockServices.find(s => s.id === serviceId && s.active)
  
  if (!service) {
    return { service: null, error: "Service not found" }
  }
  
  return { service, error: null }
}