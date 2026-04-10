import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">About HireBy</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-white">H</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">HireBy</h2>
          <p className="text-gray-600">v2.6.1</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-blue-100 leading-relaxed">
            To connect customers with trusted local service professionals, making home services accessible, reliable, and hassle-free for everyone.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Connecting Customers & Providers</h4>
              <p className="text-sm text-gray-600">
                A platform to connect service seekers with skilled professionals
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Multiple Service Categories</h4>
              <p className="text-sm text-gray-600">
                Cleaning, plumbing, electrical, painting, AC repair, and more
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Verified Professionals</h4>
              <p className="text-sm text-gray-600">
                Background verification system for trusted service providers
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold mb-1">Quality Service Delivery</h4>
              <p className="text-sm text-gray-600">
                Rating and review system to maintain service quality
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">What We Do</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            HireBy is a service marketplace platform that connects customers with local service professionals. Our goal is to make finding and hiring trusted professionals as easy as a few taps on your phone.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            We provide a platform where customers can browse services, view provider profiles, read reviews, and book services with confidence. Service providers can showcase their skills, manage bookings, and grow their business.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our platform handles scheduling, payments, and communication, making it easier for both customers and service providers to focus on what matters most - quality service delivery.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold mb-4">Get in Touch</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> support@hireby.com
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> +91 1800-123-4567
            </p>
            <p className="text-gray-700 mt-3">
              For support, please visit our Help & Support section or chat with our support team.
            </p>
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Verified Mission Control in India ⭐</p>
          <p className="text-xs text-gray-400">© 2026 HireBy Quest Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
