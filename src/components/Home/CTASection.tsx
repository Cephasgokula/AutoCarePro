import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Premium Auto Care?</h2>
            <p className="text-xl text-blue-100 mb-6">
              Book your service appointment today and join thousands of satisfied customers who trust AutoCare Pro with their vehicles.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/bookings/new"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold text-center transition-colors flex items-center justify-center"
              >
                Book an Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/services"
                className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold text-center transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-blue-700 rounded-lg p-6 shadow-lg max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="mb-4">Have questions? Our customer service team is here to help.</p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Phone:</span>
                  <a href="tel:5551234567" className="hover:text-blue-200 transition-colors">
                    (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Email:</span>
                  <a href="mailto:info@autocarepro.com" className="hover:text-blue-200 transition-colors">
                    info@autocarepro.com
                  </a>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Hours:</span>
                  <span>Mon-Sat: 8AM-6PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;