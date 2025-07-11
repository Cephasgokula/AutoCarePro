import { supabase } from "./supabase-client"
import type { Booking } from "./supabase"

export async function getBookings(userId: string): Promise<{ bookings: Booking[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        vehicle:vehicles(*),
        booking_services(
          *,
          service:services(*)
        )
      `)
      .eq("user_id", userId)
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false })

    if (error) {
      return { bookings: [], error: error.message }
    }

    return { bookings: data || [], error: null }
  } catch (error) {
    return { bookings: [], error: "Failed to fetch bookings" }
  }
}

export async function createBooking(
  userId: string,
  vehicleId: string,
  appointmentDate: string,
  appointmentTime: string,
  serviceIds: string[],
  notes?: string,
): Promise<{ booking: Booking | null; error: string | null }> {
  try {
    // Get service prices
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("id, price")
      .in("id", serviceIds)

    if (servicesError || !services) {
      return { booking: null, error: "Failed to fetch service prices" }
    }

    const totalPrice = services.reduce((sum, service) => sum + service.price, 0)

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: userId,
          vehicle_id: vehicleId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          total_price: totalPrice,
          notes,
        },
      ])
      .select("*")
      .single()

    if (bookingError || !booking) {
      return { booking: null, error: bookingError?.message || "Failed to create booking" }
    }

    // Create booking services
    const bookingServices = services.map((service) => ({
      booking_id: booking.id,
      service_id: service.id,
      price: service.price,
    }))

    const { error: servicesInsertError } = await supabase.from("booking_services").insert(bookingServices)

    if (servicesInsertError) {
      // Rollback booking if services insert fails
      await supabase.from("bookings").delete().eq("id", booking.id)
      return { booking: null, error: "Failed to create booking services" }
    }

    return { booking, error: null }
  } catch (error) {
    return { booking: null, error: "Failed to create booking" }
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"],
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    return { success: false, error: "Failed to update booking status" }
  }
}

export async function cancelBooking(bookingId: string): Promise<{ success: boolean; error: string | null }> {
  return updateBookingStatus(bookingId, "cancelled")
}
