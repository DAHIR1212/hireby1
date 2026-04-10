import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { CreditCard, Smartphone, Banknote, Shield } from 'lucide-react';
import Header from './Header.tsx';
import { useBooking } from '../context/BookingContext.tsx';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { updateBooking } = useBooking();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState('upi');

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) return;
      const docRef = doc(db, 'bookings', bookingId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setBooking({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    }
    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    if (!bookingId) return;
    
    // Update booking in Firestore
    await updateBooking(bookingId, {
      paymentStatus: 'paid',
      paymentMethod: selectedMethod,
      status: 'active'
    });

    if (selectedMethod === 'cash') {
      navigate(`/booking-tracking?bookingId=${bookingId}`);
    } else {
      navigate(`/payment-success?bookingId=${bookingId}`);
    }
  };

  if (loading) return (
    <div className="size-full flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-bold">Initializing Secure Checkout...</p>
    </div>
  );
  
  if (!booking) return (
    <div className="size-full flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-2 text-red-500">Transaction Failed</h2>
      <p className="text-gray-600 mb-6 font-medium">Session expired or invalid booking ID.</p>
      <button onClick={() => navigate('/home')} className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Back to Safety</button>
    </div>
  );

  const price = parseInt(booking.price) || 499;
  const platformFee = 50;
  const gst = Math.round(price * 0.18);
  const total = price + platformFee + gst;

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">
      <Header title="HireBy" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 space-y-8">
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
           <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <p className="text-[10px] font-black text-blue-600 mb-1 tracking-[0.2em] uppercase">Checkout Summary</p>
              <h3 className="font-black text-3xl mb-1 text-gray-900">{booking.service}</h3>
              <p className="text-sm font-bold text-gray-400">Reserved for {booking.providerName}</p>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-[22px] flex items-center justify-center text-3xl border border-blue-100/50">
              {booking.service?.toLowerCase().includes('clean') ? '🧹' : 
               booking.service?.toLowerCase().includes('plumb') ? '🔧' : '⚡'}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t-2 border-dashed border-gray-100">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400 uppercase tracking-widest text-[10px]">Service Amount</span>
              <span className="text-gray-900 font-black">₹{price}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-gray-400 uppercase tracking-widest text-[10px]">Tax & Platform</span>
              <span className="text-gray-900 font-black">₹{platformFee + gst}</span>
            </div>
            <div className="pt-4 flex justify-between items-center">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">TOTAL PAYABLE</p>
              <p className="text-4xl font-black text-[#2563EB]">₹{total}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 font-black mb-4 tracking-[0.2em] uppercase">Select Payment Mode</p>
          <div className="space-y-4">
            {[
              { id: 'upi', label: 'Online Payment', sub: 'UPI, Wallet & More', icon: '💳' },
              { id: 'card', label: 'Credit / Debit', sub: 'Instant processed', icon: '🏦' },
              { id: 'cash', label: 'Pay After', sub: 'Pay professional directly', icon: '💵' }
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-5 p-6 rounded-[28px] transition-all relative ${
                  selectedMethod === method.id ? 'bg-[#2563EB] text-white shadow-2xl shadow-blue-100 translate-x-1' : 'bg-white border border-gray-100 text-gray-900'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                  selectedMethod === method.id ? 'bg-white/20' : 'bg-gray-50'
                }`}>
                  <span>{method.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-black text-lg tracking-tight uppercase">{method.label}</p>
                  <p className={`text-xs font-bold opacity-60`}>{method.sub}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-4 ${
                  selectedMethod === method.id ? 'border-white bg-white/20' : 'border-gray-100'
                } flex items-center justify-center`}>
                  {selectedMethod === method.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-[28px] p-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
             <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase tracking-widest italic">
            "Your transaction is encrypted with bank-grade security protocols. 100% Satisfaction Guarantee."
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-6 flex flex-col gap-3">
        <button
          onClick={handlePayment}
          className="w-full bg-[#2563EB] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-50 active:scale-95 transition-all"
        >
          CONFIRM TRANSACTION
        </button>
        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          Secure Multi-Channel payment gateway
        </p>
      </div>
    </div>
  );
}

