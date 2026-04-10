import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { X, Check, Home as HomeIcon, CreditCard, Download, Share2 } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return;
      try {
        const docRef = doc(db, 'bookings', bookingId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setBooking({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  if (loading) return (
    <div className="size-full flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // Fallback if booking fails (though it shouldn't)
  const displayService = booking?.service || 'Service';
  const displayProvider = booking?.providerName || 'Provider';
  const displayPrice = booking?.price || '0';
  const displayStatus = booking?.paymentStatus || 'processing';

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between bg-white">
        <button onClick={() => navigate('/home')} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all">
          <X className="w-5 h-5 text-gray-400" />
        </button>
        <h1 className="font-black text-xl tracking-tight uppercase italic text-blue-600">HireBy</h1>
        <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all">
          <Share2 className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-8 overflow-y-auto pb-32">
        <div className="relative mb-10">
          <div className="w-28 h-28 bg-[#2563EB] rounded-[40px] flex items-center justify-center shadow-2xl shadow-blue-200 rotate-12 scale-110">
            <Check className="w-14 h-14 text-white stroke-[4] -rotate-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-[#F9FAFB]">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
        </div>

        <h2 className="text-4xl font-black mb-2 text-gray-900 tracking-tighter">Payment Success!</h2>
        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Receipt Generated Successfully</p>

        <div className="w-full bg-white border border-gray-100 rounded-[42px] p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-blue-600" />
          
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-50">
            <div className="w-16 h-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-3xl border border-blue-100/30">
               {displayService.toLowerCase().includes('clean') ? '🧹' : '🔧'}
            </div>
            <div>
              <p className="text-[10px] text-blue-600 font-black mb-1 tracking-widest uppercase">Service Quest</p>
              <h3 className="font-black text-2xl text-gray-900">{displayService}</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-1">
              <p className="text-[9px] text-gray-400 font-black tracking-widest uppercase mb-1">PARTNER</p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-[10px] font-black text-white">
                  {displayProvider[0]}
                </div>
                <p className="font-black text-sm text-gray-900 truncate uppercase">{displayProvider}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-gray-400 font-black tracking-widest uppercase mb-1">SCHEDULED</p>
              <p className="font-black text-sm text-gray-900 truncate uppercase">{booking?.scheduledTime || 'Just Now'}</p>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100/50">
            <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <span>Transaction ID</span>
              <span className="text-gray-900 font-mono">#HB-{bookingId?.slice(-6).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black tracking-widest text-gray-400 uppercase">
              <span>Status</span>
              <span className="text-green-600 flex items-center gap-1.5 font-black uppercase">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm shadow-green-200" />
                 {displayStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-black text-xs text-gray-400 uppercase tracking-widest">Total Amount</span>
            <span className="text-4xl font-black text-gray-900">₹{displayPrice}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-8 flex flex-col gap-4">
        <button
          onClick={() => navigate(`/booking-tracking?bookingId=${bookingId}`)}
          className="w-full bg-gray-900 text-white py-5 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-gray-100 active:scale-95 transition-all"
        >
          Track Expedition
        </button>
        <button
          onClick={() => navigate('/home')}
          className="w-full bg-white text-gray-400 py-3 rounded-[22px] font-black text-[10px] uppercase tracking-[0.3em] active:scale-95 transition-all text-center"
        >
          Return to Base
        </button>
      </div>
    </div>
  );
}
