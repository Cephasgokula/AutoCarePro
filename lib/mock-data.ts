// Mock types to replace Supabase types
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

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
}

// Mock data
export const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Oil Change",
    description: "Full synthetic oil change with filter replacement",
    price: 79.99,
    duration: "45 minutes",
    category: "basic",
    active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "service-2", 
    name: "Brake Inspection",
    description: "Complete brake system inspection and service",
    price: 120.00,
    duration: "1 hour",
    category: "basic",
    active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "service-3",
    name: "Tire Rotation",
    description: "Professional tire rotation and balance check",
    price: 49.99,
    duration: "30 minutes", 
    category: "basic",
    active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "service-4",
    name: "Engine Diagnostics",
    description: "Comprehensive engine diagnostic scan",
    price: 199.99,
    duration: "2 hours",
    category: "advanced",
    active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "service-5",
    name: "Transmission Service",
    description: "Complete transmission flush and service",
    price: 299.99,
    duration: "3 hours",
    category: "advanced",
    active: true,
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "service-6",
    name: "Collision Repair",
    description: "Professional collision damage repair",
    price: 1500.00,
    duration: "5-7 days",
    category: "accident",
    active: true,
    created_at: "2024-01-01T00:00:00Z"
  }
]

export const mockUser: AuthUser = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567"
}

export const mockVehicles: Vehicle[] = [
  {
    id: "vehicle-1",
    user_id: "user-1",
    make: "Toyota",
    model: "Camry",
    year: 2020,
    license_plate: "ABC-123",
    color: "Silver",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "vehicle-2",
    user_id: "user-1", 
    make: "Honda",
    model: "Accord",
    year: 2019,
    license_plate: "XYZ-789",
    color: "Black",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z"
  }
]

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    user_id: "user-1",
    vehicle_id: "vehicle-1", 
    appointment_date: "2024-02-15",
    appointment_time: "10:00",
    status: "completed",
    total_price: 79.99,
    notes: "Routine maintenance",
    created_at: "2024-02-10T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
    vehicle: mockVehicles[0],
    booking_services: [
      {
        id: "bs-1",
        booking_id: "booking-1",
        service_id: "service-1",
        price: 79.99,
        service: mockServices[0]
      }
    ]
  },
  {
    id: "booking-2",
    user_id: "user-1",
    vehicle_id: "vehicle-2",
    appointment_date: "2024-03-01",
    appointment_time: "14:00",
    status: "confirmed",
    total_price: 169.99,
    notes: "Check brakes and rotate tires",
    created_at: "2024-02-25T00:00:00Z", 
    updated_at: "2024-02-25T00:00:00Z",
    vehicle: mockVehicles[1],
    booking_services: [
      {
        id: "bs-2",
        booking_id: "booking-2",
        service_id: "service-2",
        price: 120.00,
        service: mockServices[1]
      },
      {
        id: "bs-3",
        booking_id: "booking-2", 
        service_id: "service-3",
        price: 49.99,
        service: mockServices[2]
      }
    ]
  },
  {
    id: "booking-3",
    user_id: "user-1",
    vehicle_id: "vehicle-1",
    appointment_date: "2024-03-15",
    appointment_time: "09:00",
    status: "pending",
    total_price: 199.99,
    notes: "Engine making strange noise",
    created_at: "2024-03-10T00:00:00Z",
    updated_at: "2024-03-10T00:00:00Z",
    vehicle: mockVehicles[0],
    booking_services: [
      {
        id: "bs-4",
        booking_id: "booking-3",
        service_id: "service-4", 
        price: 199.99,
        service: mockServices[3]
      }
    ]
  }
]