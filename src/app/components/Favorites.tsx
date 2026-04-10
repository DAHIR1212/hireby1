import React from 'react';
import { useNavigate } from 'react-router';
import { Heart, Star, MapPin, Wrench, Home as HomeIcon, Zap, Wind } from 'lucide-react';
import Header from './Header';
import BottomNav from './BottomNav';

export default function Favorites() {
  const navigate = useNavigate();

  const favoriteProviders = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      service: 'Home Cleaning',
      rating: 4.9,
      reviews: 127,
      location: 'Mumbai',
      icon: HomeIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      service: 'Plumbing',
      rating: 4.8,
      reviews: 95,
      location: 'Mumbai',
      icon: Wrench,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 3,
      name: 'Amit Sharma',
      service: 'Electrical',
      rating: 4.7,
      reviews: 83,
      location: 'Mumbai',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const favoriteServices = [
    {
      id: 1,
      name: 'Deep Home Cleaning',
      category: 'Cleaning',
      price: 499,
      icon: HomeIcon,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 2,
      name: 'AC Repair & Servicing',
      category: 'AC Repair',
      price: 350,
      icon: Wind,
      color: 'bg-cyan-100 text-cyan-600',
    },
  ];

  return (
    <div className="size-full flex flex-col bg-white pb-20">
      <Header title="Favorites" showBack={true} />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {favoriteProviders.length === 0 && favoriteServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Save your favorite providers and services for quick access
            </p>
            <button
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <>
            {favoriteProviders.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Favorite Providers</h2>
                  <span className="text-sm text-gray-600">{favoriteProviders.length} saved</span>
                </div>
                <div className="space-y-3">
                  {favoriteProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${provider.color}`}>
                          <provider.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-bold">{provider.name}</h3>
                              <p className="text-sm text-gray-600">{provider.service}</p>
                            </div>
                            <button
                              onClick={() => alert('Removed from favorites')}
                              className="p-1"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-semibold">{provider.rating}</span>
                              <span className="text-gray-500">({provider.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/provider-profile/${provider.id}`)}
                            className="w-full py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {favoriteServices.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Favorite Services</h2>
                  <span className="text-sm text-gray-600">{favoriteServices.length} saved</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {favoriteServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.color}`}>
                          <service.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="font-bold">{service.name}</h3>
                              <p className="text-sm text-gray-600">{service.category}</p>
                            </div>
                            <button
                              onClick={() => alert('Removed from favorites')}
                              className="p-1"
                            >
                              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <p className="font-bold text-lg">₹{service.price}<span className="text-sm text-gray-500">/hr</span></p>
                            <button
                              onClick={() => navigate(`/service/${service.id}`)}
                              className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
