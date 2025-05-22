import { Booking, Feedback, Service, ServiceStatus, User, Vehicle } from '../types';

// Mock Services
export const services: Service[] = [
  // Basic Services
  {
    id: 'service-1',
    name: 'Car Wash & Detailing',
    description: 'Complete exterior wash and interior detailing to keep your vehicle looking its best.',
    category: 'basic',
    estimatedTime: 60,
    price: 49.99
  },
  {
    id: 'service-2',
    name: 'Oil Change',
    description: 'Regular oil change with filter replacement to maintain engine health.',
    category: 'basic',
    estimatedTime: 30,
    price: 39.99
  },
  {
    id: 'service-3',
    name: 'Tire Rotation & Balancing',
    description: 'Ensure even tire wear and optimal vehicle handling with our tire rotation and balancing service.',
    category: 'basic',
    estimatedTime: 45,
    price: 29.99
  },
  {
    id: 'service-4',
    name: 'Basic Maintenance Check',
    description: 'Comprehensive inspection of all essential vehicle systems.',
    category: 'basic',
    estimatedTime: 60,
    price: 59.99
  },
  {
    id: 'service-5',
    name: 'Filter Replacement',
    description: 'Replace air, cabin, and fuel filters to maintain optimal performance.',
    category: 'basic',
    estimatedTime: 45,
    price: 49.99
  },
  
  // Advanced Services
  {
    id: 'service-6',
    name: 'Engine Diagnostics & Repair',
    description: 'Advanced computer diagnostics and expert engine repair services.',
    category: 'advanced',
    estimatedTime: 120,
    price: 149.99
  },
  {
    id: 'service-7',
    name: 'Transmission Service',
    description: 'Complete transmission fluid change and system inspection.',
    category: 'advanced',
    estimatedTime: 90,
    price: 129.99
  },
  {
    id: 'service-8',
    name: 'Electrical System Repair',
    description: 'Diagnosis and repair of vehicle electrical systems and components.',
    category: 'advanced',
    estimatedTime: 120,
    price: 159.99
  },
  {
    id: 'service-9',
    name: 'Brake System Maintenance',
    description: 'Complete brake system inspection and service including pad replacement and fluid change.',
    category: 'advanced',
    estimatedTime: 90,
    price: 119.99
  },
  {
    id: 'service-10',
    name: 'Advanced Tune-Up',
    description: 'Comprehensive engine tune-up to restore performance and efficiency.',
    category: 'advanced',
    estimatedTime: 120,
    price: 179.99
  },
  
  // Accident Repair Services
  {
    id: 'service-11',
    name: 'Body Damage Repair',
    description: 'Expert repair of vehicle body damage from minor dents to major collision damage.',
    category: 'accident',
    estimatedTime: 480,
    price: 499.99
  },
  {
    id: 'service-12',
    name: 'Paint Job',
    description: 'Professional painting services to restore your vehicle\'s appearance.',
    category: 'accident',
    estimatedTime: 360,
    price: 599.99
  },
  {
    id: 'service-13',
    name: 'Frame Straightening',
    description: 'Precision frame straightening to restore structural integrity after collision.',
    category: 'accident',
    estimatedTime: 480,
    price: 799.99
  },
  {
    id: 'service-14',
    name: 'Panel Replacement',
    description: 'Replace damaged body panels with OEM or aftermarket parts.',
    category: 'accident',
    estimatedTime: 240,
    price: 399.99
  },
  {
    id: 'service-15',
    name: 'Structural Repairs',
    description: 'Comprehensive structural repairs for severely damaged vehicles.',
    category: 'accident',
    estimatedTime: 720,
    price: 1299.99
  }
];

// Mock Users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    role: 'customer',
    createdAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '555-234-5678',
    role: 'customer',
    createdAt: '2023-02-20T10:15:00Z'
  },
  {
    id: 'user-3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '555-345-6789',
    role: 'technician',
    createdAt: '2022-11-10T09:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Sarah Davis',
    email: 'sarah.davis@example.com',
    phone: '555-456-7890',
    role: 'technician',
    createdAt: '2022-12-05T11:30:00Z'
  },
  {
    id: 'user-5',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '555-567-8901',
    role: 'admin',
    createdAt: '2022-10-01T08:00:00Z'
  }
];

// Mock Vehicles
export const vehicles: Vehicle[] = [
  {
    id: 'vehicle-1',
    make: 'Toyota',
    model: 'Camry',
    year: 2019,
    licensePlate: 'ABC123',
    ownerId: 'user-1'
  },
  {
    id: 'vehicle-2',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    licensePlate: 'DEF456',
    ownerId: 'user-1'
  },
  {
    id: 'vehicle-3',
    make: 'Ford',
    model: 'Explorer',
    year: 2018,
    licensePlate: 'GHI789',
    ownerId: 'user-2'
  },
  {
    id: 'vehicle-4',
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2021,
    licensePlate: 'JKL012',
    ownerId: 'user-2'
  }
];

// Mock Bookings
export const bookings: Booking[] = [
  {
    id: 'booking-1',
    vehicleId: 'vehicle-1',
    serviceIds: ['service-1', 'service-2'],
    status: 'completed',
    scheduledDate: '2023-05-10',
    scheduledTime: '09:00',
    notes: 'Please check tire pressure as well',
    totalPrice: 89.98,
    createdAt: '2023-05-01T14:30:00Z',
    updatedAt: '2023-05-10T11:45:00Z'
  },
  {
    id: 'booking-2',
    vehicleId: 'vehicle-3',
    serviceIds: ['service-6', 'service-9'],
    status: 'in-progress',
    scheduledDate: '2023-06-15',
    scheduledTime: '13:30',
    notes: 'Engine making unusual noise',
    totalPrice: 269.98,
    createdAt: '2023-06-10T09:15:00Z',
    updatedAt: '2023-06-15T14:00:00Z'
  },
  {
    id: 'booking-3',
    vehicleId: 'vehicle-2',
    serviceIds: ['service-3', 'service-4', 'service-5'],
    status: 'confirmed',
    scheduledDate: '2023-06-20',
    scheduledTime: '10:00',
    totalPrice: 139.97,
    createdAt: '2023-06-12T16:45:00Z',
    updatedAt: '2023-06-13T08:30:00Z'
  },
  {
    id: 'booking-4',
    vehicleId: 'vehicle-4',
    serviceIds: ['service-11', 'service-12'],
    status: 'pending',
    scheduledDate: '2023-06-25',
    scheduledTime: '08:30',
    notes: 'Accident damage on front passenger side',
    totalPrice: 1099.98,
    createdAt: '2023-06-18T11:20:00Z',
    updatedAt: '2023-06-18T11:20:00Z'
  }
];

// Mock Service Statuses
export const serviceStatuses: ServiceStatus[] = [
  {
    id: 'status-1',
    bookingId: 'booking-1',
    serviceId: 'service-1',
    status: 'completed',
    technicianId: 'user-3',
    notes: 'Completed as requested',
    startTime: '2023-05-10T09:15:00Z',
    endTime: '2023-05-10T10:20:00Z'
  },
  {
    id: 'status-2',
    bookingId: 'booking-1',
    serviceId: 'service-2',
    status: 'completed',
    technicianId: 'user-3',
    notes: 'Used synthetic oil as requested',
    startTime: '2023-05-10T10:30:00Z',
    endTime: '2023-05-10T11:00:00Z'
  },
  {
    id: 'status-3',
    bookingId: 'booking-2',
    serviceId: 'service-6',
    status: 'in-progress',
    technicianId: 'user-4',
    notes: 'Identified issue with fuel injectors',
    startTime: '2023-06-15T13:45:00Z'
  },
  {
    id: 'status-4',
    bookingId: 'booking-2',
    serviceId: 'service-9',
    status: 'pending',
    technicianId: 'user-4'
  }
];

// Mock Feedback
export const feedbacks: Feedback[] = [
  {
    id: 'feedback-1',
    bookingId: 'booking-1',
    rating: 5,
    comment: 'Excellent service! My car looks and runs great.',
    createdAt: '2023-05-11T09:30:00Z'
  }
];

// Current logged in user (for demo purposes)
export const currentUser: User = users[0]; // John Smith (customer)