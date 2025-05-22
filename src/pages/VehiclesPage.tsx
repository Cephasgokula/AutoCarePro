import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useApp } from '../context/AppContext';
import { Vehicle } from '../types';
import { Car, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const VehiclesPage: React.FC = () => {
  const { vehicles, addVehicle } = useApp();
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(newVehicle);
    setNewVehicle({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: ''
    });
    setIsAddingVehicle(false);
  };

  // Generate years for dropdown (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Layout>
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-4">My Vehicles</h1>
          <p className="text-blue-100 text-lg">
            Manage your vehicles and book services for them.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Registered Vehicles</h2>
          <button
            onClick={() => setIsAddingVehicle(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Vehicle
          </button>
        </div>

        {isAddingVehicle && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Vehicle</h3>
              <button
                onClick={() => setIsAddingVehicle(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    id="make"
                    name="make"
                    value={newVehicle.make}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={newVehicle.model}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Camry"
                  />
                </div>
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={newVehicle.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate
                  </label>
                  <input
                    type="text"
                    id="licensePlate"
                    name="licensePlate"
                    value={newVehicle.licensePlate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ABC123"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddingVehicle(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        )}

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">No vehicles registered</h3>
            <p className="text-gray-600 mb-4">
              Add your first vehicle to start booking services.
            </p>
            <button
              onClick={() => setIsAddingVehicle(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium inline-flex items-center transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Vehicle
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Car className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="font-bold">{vehicle.make} {vehicle.model}</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {vehicle.year}
        </span>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-500 text-sm">License Plate:</p>
          <p className="font-medium">{vehicle.licensePlate}</p>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          <button className="flex-1 flex items-center justify-center py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition-colors">
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
        
        <Link
          to={`/bookings/new?vehicleId=${vehicle.id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center transition-colors"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Book Service
        </Link>
      </div>
    </div>
  );
};

export default VehiclesPage;