import React from 'react';
import { CalendarCheck, Car, Wrench, CreditCard } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Car className="h-12 w-12 text-blue-500" />,
      title: 'Register Your Vehicle',
      description: 'Add your vehicle details to your profile for faster service booking.'
    },
    {
      icon: <CalendarCheck className="h-12 w-12 text-blue-500" />,
      title: 'Book an Appointment',
      description: 'Choose the services you need and select a convenient time slot.'
    },
    {
      icon: <Wrench className="h-12 w-12 text-blue-500" />,
      title: 'Service Execution',
      description: 'Our certified technicians will perform the requested services with care.'
    },
    {
      icon: <CreditCard className="h-12 w-12 text-blue-500" />,
      title: 'Payment & Pickup',
      description: 'Pay securely online or in-person and collect your serviced vehicle.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes car maintenance and repair hassle-free. Follow these simple steps to get your vehicle serviced.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full border-4 border-blue-100 mb-4 shadow-md">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {/* Step Number */}
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mt-4">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;