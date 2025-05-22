import React from 'react';
import { Wrench, Settings, Car, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCategories: React.FC = () => {
  const categories = [
    {
      id: 'basic',
      title: 'Basic Services',
      description: 'Regular maintenance to keep your vehicle running smoothly.',
      icon: <Wrench className="h-12 w-12 text-blue-500" />,
      services: ['Car Wash & Detailing', 'Oil Change', 'Tire Rotation', 'Filter Replacement'],
      image: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'advanced',
      title: 'Advanced Services',
      description: 'Comprehensive repairs and system maintenance for optimal performance.',
      icon: <Settings className="h-12 w-12 text-blue-500" />,
      services: ['Engine Repair', 'Transmission Service', 'Electrical System', 'Brake System'],
      image: 'https://images.pexels.com/photos/3822843/pexels-photo-3822843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'accident',
      title: 'Accident Repairs',
      description: 'Expert collision repair to restore your vehicle to pre-accident condition.',
      icon: <Car className="h-12 w-12 text-blue-500" />,
      services: ['Body Repair', 'Paint Jobs', 'Frame Straightening', 'Structural Repairs'],
      image: 'https://images.pexels.com/photos/3807171/pexels-photo-3807171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Service Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a comprehensive range of automotive services to meet all your vehicle maintenance and repair needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
              <div className="h-48 overflow-hidden">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="mb-6 space-y-2">
                  {category.services.map((service, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {service}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/services?category=${category.id}`}
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                >
                  View all services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;