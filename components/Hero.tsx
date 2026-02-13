import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onBookingClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookingClick }) => {
  return (
    <section className="text-white py-24" style={{ background: 'linear-gradient(135deg, #2fb5b4 0%, #1a8a8a 50%, #0f6b6b 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 10px)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ImageWithFallback
          src="https://scontent.fmnl31-1.fna.fbcdn.net/v/t1.15752-9/623223767_908754121571012_7461192778059102296_n.png?_nc_cat=111&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHNVEOQW2EuAQ4nRfA88IQaFaMtAYAGg10Voy0BgAaDXVyE96b_NOxyTyKq521p-nmtBGGys_LcTZnJ7xkSOwjk&_nc_ohc=qXgx2QsIdVQQ7kNvwEAwrLU&_nc_oc=Adn3JZjbcvnm10u7hAp_G-0wvf22PWp-ENbmrlBxAskoqgR4_2ef97GqR20rYo5qenc&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&oh=03_Q7cD4gFW1zmtVc9C3baWboNt5_ZbHNFIW6DJNuzFvsEIVv1Yjg&oe=69A8C3DE"
          alt="Hero Image"
          className="w-full max-w-md mx-auto mb-8 rounded-lg"
        />
        <h1 className="text-4xl md:text-5xl font-normal mb-8">
          Professional Laundry Service
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-600">
          Clean, fresh, and delivered to your door. Experience the convenience of modern laundry service.
        </p>
        <button
          onClick={onBookingClick}
          className="bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-600 hover:text-white transition-colors text-lg px-8 py-3 rounded-md font-medium"
        >
          Book Your Laundry Now
        </button>
      </div>
    </section>
  );
};