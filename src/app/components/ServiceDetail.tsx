import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Star, Clock, Leaf, MessageSquare } from 'lucide-react';
import imgService from "../../assets/9afd0ad2857ae7233ee28fcf232c3755c608c93a.png";

export default function ServiceDetail() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center absolute top-0 left-0 right-0 z-10 bg-transparent">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 pt-14">
        <div className="relative h-56 bg-gray-200">
          <img src={imgService} alt="Home Cleaning" className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold">4.9</span>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs text-blue-600 font-semibold mb-2">CLEANING</p>
          <h1 className="text-2xl font-bold mb-4">Home Cleaning</h1>

          <button
            onClick={() => navigate('/provider-profile/1')}
            className="w-full flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 text-left hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">PROVIDER</p>
              <p className="font-semibold">Sarah Jenkins</p>
            </div>
            <MessageSquare className="w-5 h-5 text-gray-400" />
          </button>

          <div>
            <p className="text-sm font-semibold mb-2 text-gray-700">SERVICE DESCRIPTION</p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Professional deep cleaning service including sanitization of all surfaces, dusting, and floor scrubbing. Perfect for maintaining a pristine living environment with eco-friendly products.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 mb-1">ESTIMATED DURATION</p>
                <p className="font-semibold">2-4 Hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
              <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-600 mb-1">ECO-FRIENDLY</p>
                <p className="font-semibold">Eco Products</p>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <p className="text-xs text-gray-600">STARTING AT</p>
            <p className="text-3xl font-bold">₹499<span className="text-sm text-gray-500">/hr</span></p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <button
          onClick={() => navigate('/booking-confirmation')}
          className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold"
        >
          Book Service
        </button>
      </div>
    </div>
  );
}
