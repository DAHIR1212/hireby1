import React from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Clock, Phone, MessageSquare, User } from 'lucide-react';
import Header from './Header';

export default function BookingRequest() {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate('/active-job');
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <Header title="HireBy" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <h2 className="text-2xl font-bold mb-6">Booking Request</h2>

        <div className="bg-blue-50 rounded-2xl p-6 mb-6">
          <p className="text-xs text-blue-600 font-semibold mb-2">SERVICE REQUEST</p>
          <h3 className="text-2xl font-bold mb-4">Pipe Leakage Repair</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Today, 4:30 PM - 5:30 PM</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-600 font-semibold mb-3">CUSTOMER DETAILS</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Rahul Sharma</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-yellow-500">★</span>
                <span>4.8</span>
                <span className="text-gray-400">• Customer since 2022</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-lg font-semibold">
              <Phone className="w-5 h-5" />
              Call
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 rounded-lg font-semibold">
              <MessageSquare className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">SERVICE LOCATION</p>
              <p className="font-semibold">Flat 301, Sunshine Apartments</p>
              <p className="text-sm text-gray-600">Andheri West, Mumbai 400058</p>
              <p className="text-sm text-blue-600 font-semibold mt-2">2.4 km away</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-600 font-semibold mb-2">CUSTOMER NOTE</p>
          <p className="text-gray-700">
            Kitchen sink is leaking. Water is dripping from the pipe underneath. Need urgent repair.
          </p>
        </div>

        <div className="bg-white border-2 border-green-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">ESTIMATED EARNING</p>
              <p className="text-2xl font-bold text-green-600">₹450</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">DURATION</p>
              <p className="font-semibold">1 hour</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-lg font-semibold"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold"
          >
            Accept Job
          </button>
        </div>
      </div>
    </div>
  );
}
