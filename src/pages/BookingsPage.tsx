import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useApp } from '../context/AppContext';
import { Booking, Service, Vehicle } from '../types';
import { Calendar, Clock, Car, Wrench, CheckCircle, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingsPage: React.FC = () => {
  const { bookings, vehicles, services } = useApp();
  const [filter, setFilter] = useState<Booking['status'] | 'all'>('all');

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  const getVehicleById = (id: string): Vehicle | undefined => {
    return vehicles.find(vehicle => vehicle.id === id);
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.find(service => service.id === id);
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'in-progress':
        return <Wrench className="h-5 w-5 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">My Bookings</h1>
          <p className="text-blue-100 text-lg">
            View and manage your service appointments.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">Your Bookings</h2>
            <span className="bg-gray-200 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {filteredBookings.length}
            </span>
          </div>
          <Link
            to="/bookings/new"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center transition-colors"
          >
            <Calendar className="mr-2 h-5 w-5" />
            New Booking
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'confirmed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'in-progress'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'cancelled'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map(booking => {
              const vehicle = getVehicleById(booking.vehicleId);
              
              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                      <div className="flex items-center mb-3 md:mb-0">
                        <Car className="h-6 w-6 text-blue-600 mr-2" />
                        <h3 className="font-bold text-lg">
                          {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'Unknown Vehicle'}
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Appointment Date:</p>
                        <p className="font-medium">{booking.scheduledDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Appointment Time:</p>
                        <p className="font-medium">{booking.scheduledTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Total Price:</p>
                        <p className="font-bold text-blue-600">${booking.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-500 text-sm mb-2">Services:</p>
                      <div className="space-y-2">
                        {booking.serviceIds.map(serviceId => {
                          const service = getServiceById(serviceId);
                          return service ? (
                            <div key={serviceId} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                              <span>{service.name}</span>
                              <span className="font-medium">${service.price.toFixed(2)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="mb-4">
                        <p className="text-gray-500 text-sm">Notes:</p>
                        <p className="italic text-gray-700">{booking.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                      >
                        View Details
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all'
                ? "You haven't made any bookings yet."
                : `You don't have any ${filter} bookings.`}
            </p>
            <Link
              to="/bookings/new"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium inline-flex items-center transition-colors"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book a Service
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingsPage;