import { mockBookings, mockServices, type Booking } from "./mock-data"

export async function getBookings(userId: string): Promise<{ bookings: Booking[]; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Filter bookings by user (in mock data all belong to user-1)
  const userBookings = mockBookings.filter(booking => booking.user_id === userId)
  
  return { bookings: userBookings, error: null }
}

export async function createBooking(
  userId: string,
  vehicleId: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceIds: string[],
  notes?: string,
): Promise<{ booking: Booking | null; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Calculate total price from selected services
  const selectedServices = mockServices.filter(service => serviceIds.includes(service.id))
  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
  
  if (selectedServices.length === 0) {
    return { booking: null, error: "No valid services selected" }
  }
  
  // Create new booking
  const newBooking: Booking = {
    id: `booking-${Date.now()}`,
    user_id: userId,
    vehicle_id: vehicleId,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    status: "pending",
    total_price: totalPrice,
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    booking_services: selectedServices.map(service => ({
      id: `bs-${Date.now()}-${service.id}`,
      booking_id: `booking-${Date.now()}`,
      service_id: service.id,
      price: service.price,
      service
    }))
  }
  
  return { booking: newBooking, error: null }
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"],
): Promise<{ success: boolean; error: string | null }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  // Check if booking exists
  const bookingExists = mockBookings.some(b => b.id === bookingId)
  
  if (!bookingExists) {
    return { success: false, error: "Booking not found" }
  }
  
  // In a real app, this would update the database
  return { success: true, error: null }
}

export async function cancelBooking(bookingId: string): Promise<{ success: boolean; error: string | null }> {
  return updateBookingStatus(bookingId, "cancelled")
}