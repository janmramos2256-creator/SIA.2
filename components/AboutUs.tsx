import React from 'react';

export const AboutUs: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-normal text-black mb-6">About SmartWash</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing exceptional laundry services with modern technology and traditional care.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-xl font-normal mb-4 text-black">Fast Service</h3>
            <p className="text-gray-600">Same-day service available for urgent needs</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-normal mb-4 text-black">Quality Guaranteed</h3>
            <p className="text-gray-600">Professional cleaning with attention to detail</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-normal mb-4 text-black">Pickup & Delivery</h3>
            <p className="text-gray-600">Convenient door-to-door service</p>
          </div>
        </div>
      </div>
    </section>
  );
};