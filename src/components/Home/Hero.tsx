import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional Auto Care at Your Fingertips
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              From routine maintenance to complex repairs, we've got your vehicle covered with expert service and care.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-blue-200" />
                <span className="text-lg">Certified technicians</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-blue-200" />
                <span className="text-lg">Transparent pricing</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3 text-blue-200" />
                <span className="text-lg">Real-time service tracking</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/services"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center"
              >
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/bookings/new"
                className="bg-blue-800 hover:bg-blue-900 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <img
              src="https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Auto mechanic servicing a car"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;