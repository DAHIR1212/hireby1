import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Star, MapPin, CheckCircle, Award, ThumbsUp, Heart, Share2, MessageSquare, Phone } from 'lucide-react';

export default function ProviderProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  const services = [
    'Deep Cleaning',
    'Regular Cleaning',
    'Kitchen Cleaning',
    'Bathroom Cleaning',
    'Move-in/Move-out Cleaning',
  ];

  const reviews = [
    {
      id: 1,
      user: 'Rahul Sharma',
      rating: 5,
      date: 'Oct 15, 2023',
      comment: 'Excellent service! Very professional and thorough. The apartment looks brand new.',
      helpful: 12,
    },
    {
      id: 2,
      user: 'Priya Verma',
      rating: 5,
      date: 'Oct 10, 2023',
      comment: 'Sarah is amazing! Arrived on time, very detail-oriented. Highly recommended.',
      helpful: 8,
    },
    {
      id: 3,
      user: 'Amit Kumar',
      rating: 4,
      date: 'Oct 5, 2023',
      comment: 'Good work overall. Could have been more thorough in some areas but satisfied with the service.',
      helpful: 5,
    },
  ];

  const portfolio = [
    { id: 1, category: 'Kitchen' },
    { id: 2, category: 'Living Room' },
    { id: 3, category: 'Bathroom' },
    { id: 4, category: 'Bedroom' },
  ];

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              } transition-colors`}
            />
          </button>
          <button
            onClick={() => alert('Share profile')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl flex-shrink-0"></div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Sarah Jenkins</h1>
                  <p className="text-gray-600">Professional Cleaner</p>
                </div>
                <div className="px-3 py-1 bg-green-100 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">VERIFIED</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-gray-500">(127)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Mumbai</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 mb-1">156</p>
              <p className="text-xs text-gray-600">Jobs Done</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 mb-1">5</p>
              <p className="text-xs text-gray-600">Years Exp</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600 mb-1">98%</p>
              <p className="text-xs text-gray-600">Satisfied</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">
              Professional cleaning specialist with 5+ years of experience. Specialized in deep cleaning, move-in/move-out services, and eco-friendly cleaning solutions. Background verified and insured.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {services.map((service, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Certifications & Badges</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="font-semibold text-sm">Top Rated</p>
                  <p className="text-xs text-gray-600">2023</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Verified Pro</p>
                  <p className="text-xs text-gray-600">Background Check</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3">Portfolio</h2>
            <div className="grid grid-cols-2 gap-3">
              {portfolio.map((item) => (
                <div key={item.id} className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white font-semibold text-sm">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Reviews ({reviews.length})</h2>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-bold">4.9</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full py-3 mt-4 text-blue-600 font-semibold">
              View All Reviews
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <button
            onClick={() => alert('Calling...')}
            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <Phone className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <MessageSquare className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => navigate('/service/1')}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold"
          >
            Book Service
          </button>
        </div>
      </div>
    </div>
  );
}
