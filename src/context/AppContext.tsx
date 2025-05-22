import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, Feedback, Service, ServiceStatus, User, Vehicle } from '../types';
import { bookings, currentUser, feedbacks, serviceStatuses, services, users, vehicles } from '../data/mockData';

interface AppContextType {
  // Data
  services: Service[];
  users: User[];
  vehicles: Vehicle[];
  bookings: Booking[];
  serviceStatuses: ServiceStatus[];
  feedbacks: Feedback[];
  currentUser: User;
  
  // State management functions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'ownerId'>) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  updateServiceStatus: (statusId: string, status: ServiceStatus['status'], notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [servicesState, setServices] = useState<Service[]>(services);
  const [usersState, setUsers] = useState<User[]>(users);
  const [vehiclesState, setVehicles] = useState<Vehicle[]>(vehicles);
  const [bookingsState, setBookings] = useState<Booking[]>(bookings);
  const [serviceStatusesState, setServiceStatuses] = useState<ServiceStatus[]>(serviceStatuses);
  const [feedbacksState, setFeedbacks] = useState<Feedback[]>(feedbacks);
  const [currentUserState] = useState<User>(currentUser);

  // Add a new vehicle
  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'ownerId'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `vehicle-${vehiclesState.length + 1}`,
      ownerId: currentUserState.id
    };
    setVehicles([...vehiclesState, newVehicle]);
  };

  // Create a new booking
  const createBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...booking,
      id: `booking-${bookingsState.length + 1}`,
      createdAt: now,
      updatedAt: now
    };
    setBookings([...bookingsState, newBooking]);

    // Create service statuses for each service in the booking
    const newServiceStatuses: ServiceStatus[] = booking.serviceIds.map((serviceId, index) => ({
      id: `status-${serviceStatusesState.length + index + 1}`,
      bookingId: newBooking.id,
      serviceId,
      status: 'pending'
    }));
    
    setServiceStatuses([...serviceStatusesState, ...newServiceStatuses]);
  };

  // Update booking status
  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(
      bookingsState.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status, updatedAt: new Date().toISOString() } 
          : booking
      )
    );
  };

  // Add feedback for a booking
  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: `feedback-${feedbacksState.length + 1}`,
      createdAt: new Date().toISOString()
    };
    setFeedbacks([...feedbacksState, newFeedback]);
  };

  // Update service status
  const updateServiceStatus = (statusId: string, status: ServiceStatus['status'], notes?: string) => {
    setServiceStatuses(
      serviceStatusesState.map(serviceStatus => {
        if (serviceStatus.id === statusId) {
          const updatedStatus: ServiceStatus = { ...serviceStatus, status };
          
          if (notes) {
            updatedStatus.notes = notes;
          }
          
          if (status === 'in-progress' && !serviceStatus.startTime) {
            updatedStatus.startTime = new Date().toISOString();
          }
          
          if (status === 'completed' && !serviceStatus.endTime) {
            updatedStatus.endTime = new Date().toISOString();
          }
          
          return updatedStatus;
        }
        return serviceStatus;
      })
    );
  };

  const value = {
    services: servicesState,
    users: usersState,
    vehicles: vehiclesState,
    bookings: bookingsState,
    serviceStatuses: serviceStatusesState,
    feedbacks: feedbacksState,
    currentUser: currentUserState,
    
    addVehicle,
    createBooking,
    updateBookingStatus,
    addFeedback,
    updateServiceStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};