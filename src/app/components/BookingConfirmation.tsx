import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import Header from './Header';
import { useBooking } from '../context/BookingContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState('Tomorrow');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  // Take data from local storage or context (mocking for now if not available)
  const service = localStorage.getItem('selectedService') || 'Home Cleaning';
  const price = localStorage.getItem('selectedPrice') || '499';
  const providerId = localStorage.getItem('selectedProviderPhone') || '9876543210';
  const providerName = localStorage.getItem('selectedProviderName') || 'Professional Partner';

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const userPhone = localStorage.getItem('userPhone') || currentUser?.phone?.replace('+91', '') || '';
      const userName = localStorage.getItem('userName') || currentUser?.name || 'Customer';

      await createBooking({
        customerId: userPhone,
        customerName: userName,
        customerPhone: userPhone,
        providerId: providerId,
        providerName: providerName,
        providerPhone: providerId, // Store for direct calling
        instructions: instructions, // Store user's special request
        service: service,
        status: 'pending',
        address: localStorage.getItem('userAddress') || 'Flat 301, Sunshine Apartments, Mumbai',
        scheduledTime: `${selectedDate}, ${selectedTime}`,
        price: price,
      });

      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <Header title="HireBy" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
        <h2 className="text-2xl font-bold mb-2">Confirm Booking</h2>
        <p className="text-gray-600 mb-6">Review your booking details</p>

        <div className="bg-blue-600 rounded-[28px] p-6 text-white mb-8 shadow-xl shadow-blue-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
             {service.toLowerCase().includes('clean') ? '🧹' : 
              service.toLowerCase().includes('plumb') ? '🔧' : '🏠'}
          </div>
          <div>
            <p className="text-[10px] font-black opacity-60 tracking-widest uppercase">SELECTED SERVICE</p>
            <h3 className="text-xl font-black">{service}</h3>
            <p className="text-sm font-bold opacity-80">With {providerName}</p>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-[10px] font-black mb-3 text-gray-400 uppercase tracking-widest">SCHEDULE</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['Today', 'Tomorrow', 'Oct 7', 'Oct 8'].map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`px-6 py-3 rounded-2xl border-2 font-bold transition-all text-xs whitespace-nowrap ${
                    selectedDate === date
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-100 text-gray-500'
                  }`}
                >
                  {date}
                </button>
              ))}
            </div>
          </div>

          <div>
             <div className="grid grid-cols-3 gap-3">
              {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-2xl border-2 font-bold text-[10px] transition-all ${
                    selectedTime === time
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-100 text-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black mb-3 text-gray-400 uppercase tracking-widest">SERVICE ADDRESS</label>
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-[28px] border border-gray-100">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900">Delivery Address</p>
                <p className="text-sm text-gray-500 truncate font-semibold">123 Main Street, Mumbai, 400001</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black mb-3 text-gray-400 uppercase tracking-widest">SPECIAL INSTRUCTIONS (OPTIONAL)</label>
            <div className="relative">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex: Please bring eco-friendly cleaning products. Mention any specific requirements..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[28px] p-5 text-sm font-semibold text-gray-900 placeholder:text-gray-300 min-h-[120px] focus:outline-none focus:border-blue-300 transition-colors"
              />
              <MessageCircle className="absolute right-6 bottom-6 w-5 h-5 text-gray-200" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[28px] p-8 text-white shadow-2xl shadow-gray-200 mb-8">
           <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold opacity-60">
              <span>BASE CHARGE</span>
              <span>₹{price}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold opacity-60 border-b border-white/10 pb-4">
              <span>ADMIN & TAX</span>
              <span>₹50</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-black uppercase">Grand Total</span>
              <span className="text-3xl font-black text-blue-400">₹{parseInt(price) + 50}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 flex items-center justify-between gap-4">
        <div className="flex-1">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TOTAL VALUE</p>
           <p className="text-xl font-black text-gray-900">₹{parseInt(price) + 50}</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="flex-[2] bg-blue-600 text-white py-5 rounded-[22px] font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100"
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              CONFIRM BOOKING
            </>
          )}
        </button>
      </div>
    </div>
  );
}

