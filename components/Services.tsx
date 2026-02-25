import React from 'react';

interface Service {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  description: string;
  features: string[];
  status: 'active' | 'inactive';
}

interface ServicesProps {
  services: Service[];
}

export const Services: React.FC<ServicesProps> = ({ services }) => {

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-normal text-black mb-6">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our range of professional laundry services designed to meet your needs.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {services.filter(service => service.status === 'active').map((service) => (
            <div key={service.id} className="border border-gray-200 p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-normal text-black mb-2">{service.title}</h3>
                <div className="text-2xl font-normal text-black">₱{service.price}{service.priceUnit}</div>
              </div>
              <p className="text-gray-600 mb-6 text-center">{service.description}</p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-600 text-center">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};