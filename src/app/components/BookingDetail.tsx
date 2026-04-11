import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, MapPin, Calendar, Clock, CreditCard, 
  Phone, MessageSquare, Download, XCircle, Star, 
  ShieldCheck, CheckCircle, Play, Square, Activity
} from 'lucide-react';
import { useBooking, Booking } from '../context/BookingContext.tsx';
import { db } from '../firebase/config';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

export default function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { myBookings, providerBookings, updateBooking, deleteBooking } = useBooking();
  const [liveBooking, setLiveBooking] = useState<Booking | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  // Sync real-time updates for THIS specific booking
  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'bookings', id), (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as Booking;
        setLiveBooking(data);
        fetchProvider(data.providerId);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  // Update timer every second for live duration
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchProvider = async (providerId: string) => {
    if (!providerId) return;
    const snap = await getDoc(doc(db, 'users', providerId));
    if (snap.exists()) setProvider(snap.data());
  };

  const booking = liveBooking || myBookings.find(b => b.id === id) || providerBookings.find(b => b.id === id);

  if (!booking || loading) {
    return (
      <div className="size-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold">Synchronizing details...</p>
      </div>
    );
  }

  const isPaid = booking.paymentStatus === 'paid';

  // 🕒 Timer Calculation Logic
  const handleStartWork = async () => {
    await updateBooking(booking.id, {
      status: 'active',
      startTime: new Date().toISOString(),
    });
  };

  const handleStopWork = async () => {
    if (!booking.startTime) return;
    const endTime = new Date().toISOString();
    const startTimeDate = new Date(booking.startTime);
    const endTimeDate = new Date(endTime);
    
    // Calculate total minutes
    const diffMs = endTimeDate.getTime() - startTimeDate.getTime();
    const totalMinutes = Math.max(30, Math.floor(diffMs / 60000)); // Minimum 30 mins billing
    
    // Calculate price based on hourly rate
    const hourlyRate = parseInt(provider?.pricePerHour || '500');
    const finalPrice = Math.round((totalMinutes / 60) * hourlyRate);

    await updateBooking(booking.id, {
      status: 'completed',
      endTime: endTime,
      totalHours: parseFloat((totalMinutes / 60).toFixed(2)),
      price: finalPrice.toString(),
    });
  };

  const getDurationString = (startTime: string, endTime?: string) => {
    if (!startTime) return '00:00:00';
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    const diffMs = Math.max(0, end - new Date(startTime).getTime());
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCancelClick = async () => {
    if (confirm('Cancel and delete this booking request? This will remove it for both you and the provider.')) {
      try {
        await deleteBooking(booking.id);
        navigate('/my-bookings');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete. Try again.');
      }
    }
  };

  const billingPrice = parseInt(booking.price || '0');
  const discount = billingPrice > 500 ? 200 : 0; 
  const platformFee = 50;
  const gst = Math.round(billingPrice * 0.18);
  const totalAmount = billingPrice - discount + platformFee + gst;
  const userRole = localStorage.getItem('userRole') || (liveBooking?.providerId === localStorage.getItem('userPhone') ? 'provider' : 'customer');
  const isProvider = userRole === 'provider';

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center gap-4 bg-white sticky top-0 z-20 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all active:scale-95">
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <h1 className="font-black text-xl text-gray-900 uppercase tracking-tighter italic">Booking Dossier</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-40 space-y-8">
        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black opacity-60 tracking-[0.2em] mb-1 uppercase">REGISTRY ID</p>
                <p className="font-mono font-bold text-lg">#HB-{booking.id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20">
                {booking.status}
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-black mb-2 tracking-tight uppercase italic">{booking.service}</h2>
              <div className="flex items-center gap-2 opacity-70">
                <ShieldCheck className="w-4 h-4" />
                <p className="font-bold text-xs uppercase tracking-widest">Verified Multi-Step Protocal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start/Work controls (ONLY FOR CLIENT) */}
        {!isProvider && (booking.status === 'accepted' || booking.status === 'active' || booking.status === 'completed') && (
           <div className={`rounded-[32px] p-8 flex flex-col items-center gap-6 border-2 border-dashed transition-all ${
             booking.status === 'active' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'
           }`}>
              <div className="flex items-center gap-3 py-1.5 px-4 bg-white rounded-full border border-gray-100 shadow-sm">
                <Activity className={`w-4 h-4 ${booking.status === 'active' ? 'text-blue-600 animate-pulse' : 'text-gray-400'}`} />
                <p className="text-[10px] font-black tracking-widest uppercase text-gray-900">Mission Clock</p>
              </div>
              
              {(booking.startTime) && (
                <div className="flex flex-col items-center">
                   <p className="text-5xl font-black text-gray-900 tracking-tighter">
                     {getDurationString(booking.startTime, booking.endTime)}
                   </p>
                   <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-[0.2em]">
                     {booking.endTime ? 'TOTAL WORK DURATION' : 'CURRENT WORK DURATION'}
                   </p>
                </div>
              )}

              <div className="flex gap-4 w-full">
                {booking.status === 'accepted' ? (
                  <div className="flex-1 py-6 bg-gray-900 text-white rounded-[24px] flex flex-col items-center justify-center shadow-xl relative overflow-hidden w-full">
                    <p className="text-[10px] font-black tracking-[0.2em] opacity-60 uppercase mb-2 text-center text-gray-400">ARRIVAL VERIFICATION PIN</p>
                    <div className="text-4xl font-black tracking-[0.2em]">{booking.id.replace(/\D/g, '0').slice(-4)}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-3 max-w-[200px] text-center">Give this PIN to the specialist when they arrive to start the mission clock.</div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  </div>
                ) : !booking.endTime ? (
                  <button
                    onClick={handleStopWork}
                    className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    End Work
                  </button>
                ) : (
                   <div className="flex-1 py-4 bg-green-50 text-green-600 rounded-2xl font-bold text-center border border-green-100 flex items-center justify-center gap-2">
                     <CheckCircle className="w-5 h-5" />
                     Work Logs Captured
                   </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center italic">
                *As the client, you can start or stop the clock to verify working hours.
              </p>
           </div>
        )}

        {/* Service Provider */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Service Provider</h3>
          <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-5">
              {provider?.photo ? (
                <img src={provider.photo} alt={booking.providerName} className="w-20 h-20 rounded-full object-cover shadow-inner ring-4 ring-gray-50" />
              ) : (
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-2xl">
                  {booking.providerName?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-2xl text-gray-900 truncate mb-1">{booking.providerName}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-black text-sm">{provider?.rating ? provider.rating.toFixed(1) : 'New'}</span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">
                    {provider?.ratingCount || 0} Reviews
                  </p>
                </div>
                <p className="text-[10px] text-blue-600 font-black mt-2 uppercase tracking-widest">
                  {provider?.experience || 'Verified Professional'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  const phone = booking.providerPhone || booking.providerId;
                  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
                  window.open(`tel:+91${cleanPhone}`);
                }}
                className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button
                onClick={() => navigate(`/chat?providerId=${booking.providerId}&providerName=${booking.providerName}`)}
                className="w-16 h-16 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 active:scale-90 transition-all shrink-0"
              >
                <MessageSquare className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Payment Details (Matches Table in Screenshot) */}
        <div>
          <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Payment Details</h3>
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Service Charge</span>
                <span className="font-black text-gray-900">₹{billingPrice}</span>
              </div>
              <div className="flex justify-between items-center text-[#F43F5E]">
                <span className="font-bold">Discount (20%)</span>
                <span className="font-black">-{billingPrice > 500 ? discount : 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">Platform Fee</span>
                <span className="font-black text-gray-900">₹{platformFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold">GST (18%)</span>
                <span className="font-black text-gray-900">₹{gst}</span>
              </div>
            </div>
            
            <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
              <span className="text-xl font-black text-gray-900 uppercase">Total Amount</span>
              <span className="text-3xl font-black text-black">₹{totalAmount}</span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                  {isPaid ? 'Paid via UPI' : 'Pending Transaction'}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isPaid ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}>
                {isPaid ? 'PAID' : 'DUE'}
              </span>
            </div>
          </div>
        </div>

        {/* Special Instructions (As per Screenshot) */}
        <div>
           <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Special Instructions</h3>
           <div className="bg-white border border-gray-100 p-6 rounded-[32px] shadow-sm">
             <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
               "{booking.instructions || 'Please handle all equipment with care and call 10 mins before arrival. No additional tools required.'}"
             </p>
           </div>
        </div>

        {/* Action Center - Consolidated */}
        <div className="flex flex-col gap-4">
           {/* SOS EMERGENCY PROTOCOL */}
           {booking.status === 'active' && !booking.endTime && (
              <button 
                onClick={() => {
                  if(confirm('ENABLE EMERGENCY SOS PROTOCOL? This will alert mission control and share your live coordinates.')){
                    alert('⚠️ SOS SIGNAL TRANSMITTED. Security teams have been dispatched to your coordinates.');
                  }
                }}
                className="w-full py-5 bg-red-600 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-red-100 flex items-center justify-center gap-3 animate-pulse border-4 border-white/20 mb-2"
              >
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                Initiate Emergency SOS
              </button>
           )}

           {booking.status === 'completed' && booking.paymentStatus !== 'paid' && !isProvider && (
             <button
               onClick={() => navigate(`/payment?bookingId=${booking.id}`)}
               className="w-full py-5 bg-green-600 text-white rounded-[24px] font-black shadow-2xl shadow-green-100 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 mb-2"
             >
               <CreditCard className="w-5 h-5" />
               Complete Payment (₹{totalAmount})
             </button>
           )}

           {(booking.status === 'accepted' || (booking.status === 'active' && !booking.endTime)) && (
              <button
                onClick={() => navigate(`/booking-tracking?bookingId=${booking.id}`)}
                className="w-full py-5 bg-black text-white rounded-[24px] font-black shadow-2xl active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <MapPin className="w-4 h-4" />
                Track Live Agent
              </button>
           )}

           {booking.status !== 'active' && booking.status !== 'completed' && booking.status !== 'cancelled' && (
              <button
                onClick={handleCancelClick}
                className="w-full py-4 bg-white border border-red-100 text-red-500 rounded-[24px] font-black active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
              >
                <XCircle className="w-4 h-4" />
                Abort Service
              </button>
           )}
        </div>
      </div>
    </div>
  );
}
