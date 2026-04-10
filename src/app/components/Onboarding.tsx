import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Shield, Star, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Search,
      color: 'bg-blue-600',
      title: 'Find Local Services',
      description: 'Discover verified professionals for all your home service needs in your area',
    },
    {
      icon: Shield,
      color: 'bg-green-600',
      title: 'Trusted & Verified',
      description: 'All service providers are background-verified and insured for your safety',
    },
    {
      icon: Star,
      color: 'bg-purple-600',
      title: 'Quality Guaranteed',
      description: 'Read reviews, compare prices, and book the best professionals with confidence',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate('/landing');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/landing');
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-6 py-6 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-gray-600 font-semibold"
        >
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className={`w-32 h-32 ${slides[currentSlide].color} rounded-3xl flex items-center justify-center mb-12 shadow-2xl`}>
          {React.createElement(slides[currentSlide].icon, {
            className: 'w-16 h-16 text-white',
          })}
        </div>

        <h2 className="text-3xl font-bold mb-4 text-center">
          {slides[currentSlide].title}
        </h2>
        <p className="text-gray-600 text-center text-lg leading-relaxed max-w-sm mb-12">
          {slides[currentSlide].description}
        </p>

        <div className="flex items-center gap-2 mb-12">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-gray-900'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {currentSlide < slides.length - 1 ? 'Next' : 'Get Started'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
