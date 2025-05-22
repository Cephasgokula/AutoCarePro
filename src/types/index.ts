export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  ownerId: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'accident';
  estimatedTime: number; // in minutes
  price: number;
}

export interface Booking {
  id: string;
  vehicleId: string;
  serviceIds: string[];
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'technician' | 'admin';
  createdAt: string;
}

export interface ServiceStatus {
  id: string;
  bookingId: string;
  serviceId: string;
  status: 'pending' | 'in-progress' | 'completed';
  technicianId?: string;
  notes?: string;
  startTime?: string;
  endTime?: string;
}

export interface Feedback {
  id: string;
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}