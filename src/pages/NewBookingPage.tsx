import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { Calendar, Clock, Car, ArrowLeft, ArrowRight, CheckCircle, Info } from 'lucide-react';

const NewBookingPage: React.FC = () => {
  const { vehicles, services, createBooking } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Form state
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  
  // Calculate total price
  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);

  // Initialize vehicle from URL params if available
  useEffect(() => {
    const vehicleId = searchParams.get('vehicleId');
    if (vehicleId && vehicles.some(v => v.id === vehicleId)) {
      setSelectedVehicleId(vehicleId);
    }
  }, [searchParams, vehicles]);

  // Group services by category
  const servicesByCategory: Record<string, Service[]> = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    },
    {} as Record<string, Service[]>
  );

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle service selection
  const toggleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    // Create booking
    createBooking({
      vehicleId: selectedVehicleId,
      serviceIds: selectedServices,
      status: 'pending',
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      notes: notes.trim() || undefined,
      totalPrice
    });
    
    // Navigate to bookings page
    navigate('/bookings');
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Layout>
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">Book a Service</h1>
          <p className="text-blue-100 text-lg">
            Schedule maintenance or repairs for your vehicle.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= stepNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step > stepNumber ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span className="text-sm mt-2 text-gray-600">
                    {stepNumber === 1 && 'Vehicle'}
                    {stepNumber === 2 && 'Services'}
                    {stepNumber === 3 && 'Schedule'}
                    {stepNumber === 4 && 'Review'}
                  </span>
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Vehicle */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Select Your Vehicle</h2>
              
              {vehicles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedVehicleId === vehicle.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                    >
                      <div className="flex items-center mb-2">
                        <Car className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-medium">{vehicle.make} {vehicle.model}</h3>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Year: {vehicle.year}</p>
                        <p>License Plate: {vehicle.licensePlate}</p>
                      </div>
                      {selectedVehicleId === vehicle.id && (
                        <div className="mt-2 text-blue-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
                  <p className="text-gray-600 mb-4">
                    You need to add a vehicle before booking a service.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/vehicles')}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Add a Vehicle
                  </button>
                </div>
              )}
              
              {vehicles.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!selectedVehicleId}
                    className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                      selectedVehicleId
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Services */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Select Services</h2>
              
              <div className="space-y-6">
                {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 capitalize">
                      {category} Services
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryServices.map(service => (
                        <div
                          key={service.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedServices.includes(service.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => toggleServiceSelection(service.id)}
                        >
                          <div className="flex justify-between">
                            <h4 className="font-medium">{service.name}</h4>
                            <span className="font-bold text-blue-600">${service.price.toFixed(2)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 mb-2">{service.description}</p>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Est. time: {service.estimatedTime < 60
                              ? `${service.estimatedTime} min`
                              : `${Math.floor(service.estimatedTime / 60)} hr${
                                  service.estimatedTime % 60 !== 0
                                    ? ` ${service.estimatedTime % 60} min`
                                    : ''
                                }`}
                            </span>
                            {selectedServices.includes(service.id) && (
                              <span className="text-blue-600 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedServices.length > 0 && (
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Selected Services: {selectedServices.length}</p>
                      <p className="text-sm text-gray-600">
                        Click on a service to deselect it
                      </p>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      Total: ${totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={selectedServices.length === 0}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                    selectedServices.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Schedule Your Appointment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-5 w-5 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    min={getMinDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-5 w-5 inline mr-2" />
                    Select Time
                  </label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any specific issues or requests..."
                ></textarea>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                    selectedDate && selectedTime
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Review Your Booking</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Vehicle</h3>
                  {vehicles.map(vehicle => 
                    vehicle.id === selectedVehicleId && (
                      <div key={vehicle.id} className="flex items-center">
                        <Car className="h-5 w-5 text-blue-600 mr-2" />
                        <span>{vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.licensePlate}</span>
                      </div>
                    )
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Services</h3>
                  <div className="space-y-2">
                    {selectedServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      return service && (
                        <div key={service.id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span className="font-medium">${service.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Appointment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Date: {selectedDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <span>Time: {selectedTime}</span>
                    </div>
                  </div>
                </div>
                
                {notes && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Additional Notes</h3>
                    <p className="italic">{notes}</p>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    By confirming this booking, you agree to our terms of service. You can cancel or reschedule your appointment up to 24 hours before the scheduled time.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Confirm Booking
                  <CheckCircle className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default NewBookingPage;