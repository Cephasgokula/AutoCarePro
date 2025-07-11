import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface User {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  user_id: string
  make: string
  model: string
  year: number
  license_plate: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: "basic" | "advanced" | "accident"
  active: boolean
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  vehicle_id: string
  appointment_date: string
  appointment_time: string
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  total_price: number
  notes?: string
  created_at: string
  updated_at: string
  vehicle?: Vehicle
  booking_services?: BookingService[]
}

export interface BookingService {
  id: string
  booking_id: string
  service_id: string
  price: number
  service?: Service
}
