import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useApp } from '../context/AppContext';
import { Booking, ServiceStatus } from '../types';
import { 
  Car, Calendar, Clock, Wrench, CheckCircle, AlertCircle, XCircle, 
  ArrowLeft, Star, MessageSquare, Printer, Ban
} from 'lucide-react';

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    bookings, 
    vehicles, 
    services, 
    serviceStatuses, 
    updateBookingStatus, 
    addFeedback 
  } = useApp();
  
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // Find the booking
  const booking = bookings.find(b => b.id === id);
  
  // Find the vehicle
  const vehicle = booking ? vehicles.find(v => v.id === booking.vehicleId) : undefined;
  
  // Find the services
  const bookingServices = booking 
    ? booking.serviceIds.map(serviceId => services.find(s => s.id === serviceId)).filter(Boolean)
    : [];
  
  // Find the service statuses
  const bookingServiceStatuses = booking
    ? serviceStatuses.filter(status => status.bookingId === booking.id)
    : [];
  
  // Handle if booking not found
  if (!booking || !vehicle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
            <p className="text-gray-600 mb-6">
              The booking you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/bookings')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium inline-flex items-center transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Bookings
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const getStatusIcon = (status: Booking['status'] | ServiceStatus['status']) => {
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
  
  const getStatusColor = (status: Booking['status'] | ServiceStatus['status']) => {
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
  
  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBookingStatus(booking.id, 'cancelled');
    }
  };
  
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedback({
      bookingId: booking.id,
      rating,
      comment: comment.trim() || undefined
    });
    setShowFeedbackForm(false);
  };
  
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const canLeaveFeedback = booking.status === 'completed';
  
  return (
    <Layout>
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/bookings')}
              className="mr-4 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Booking Details</h1>
              <p className="text-blue-100">
                View the details and status of your service appointment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Car className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold">
                  {vehicle.make} {vehicle.model} ({vehicle.year})
                </h2>
              </div>
              <div className="flex items-center">
                <span className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-2 capitalize">{booking.status}</span>
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-700">Appointment Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Date: {booking.scheduledDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-2" />
                    <span>Time: {booking.scheduledTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-700">Vehicle Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Car className="h-5 w-5 text-blue-600 mr-2" />
                    <span>{vehicle.make} {vehicle.model}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-medium mr-2">Year:</span>
                    <span>{vehicle.year}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-medium mr-2">License:</span>
                    <span>{vehicle.licensePlate}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-gray-700">Booking Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-blue-600 font-medium mr-2">Booking ID:</span>
                    <span>{booking.id}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-medium mr-2">Created:</span>
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-600 font-medium mr-2">Last Updated:</span>
                    <span>{new Date(booking.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Services</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingServices.map(service => {
                      const serviceStatus = bookingServiceStatuses.find(
                        status => status.serviceId === service?.id
                      );
                      
                      return service && (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {service.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {serviceStatus && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(serviceStatus.status)}`}>
                                {getStatusIcon(serviceStatus.status)}
                                <span className="ml-1 capitalize">{serviceStatus.status}</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            ${service.price.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-6 py-4 text-right font-bold">
                        Total
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600">
                        ${booking.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {booking.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Additional Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="italic text-gray-700">{booking.notes}</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Printer className="mr-2 h-5 w-5" />
                Print Details
              </button>
              
              {canLeaveFeedback && (
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Star className="mr-2 h-5 w-5" />
                  Leave Feedback
                </button>
              )}
              
              {canCancel && (
                <button
                  onClick={handleCancelBooking}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Ban className="mr-2 h-5 w-5" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Feedback Form */}
        {showFeedbackForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Leave Feedback</h3>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmitFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                  Your comments (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-2 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="comment"
                    rows={4}
                    className="pl-10 block w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Share your experience with our service..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingDetailPage;