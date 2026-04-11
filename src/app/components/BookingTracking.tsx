import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Phone, MessageSquare, MapPin, CheckCircle, Clock } from 'lucide-react';
import Header from './Header';
import { db } from '../firebase/config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function BookingTracking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    // Use onSnapshot for real-time status updates while tracking
    const unsubscribe = onSnapshot(doc(db, 'bookings', bookingId), async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setBooking({ id: snap.id, ...data });

        // Fetch provider profile if not already fetched
        if (!provider && data.providerId) {
          const pSnap = await getDoc(doc(db, 'users', data.providerId));
          if (pSnap.exists()) {
            setProvider(pSnap.data());
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [bookingId]);

  if (loading) return (
    <div className="size-full flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!booking) return (
    <div className="size-full flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-xl font-bold mb-2">Tracking Expired</h2>
      <p className="text-gray-500 mb-6">Redirecting to history...</p>
      <button onClick={() => navigate('/my-bookings')} className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">Go Back</button>
    </div>
  );

  const status = booking.status;

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">
      <Header title="Quest Tracking" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="bg-[#2563EB] rounded-[32px] p-8 text-white mb-8 shadow-2xl shadow-blue-200 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black opacity-60 tracking-[0.2em] mb-1 uppercase">ESTIMATED ARRIVAL</p>
            <p className="text-4xl font-black">{status === 'active' ? 'Live Now' : '8 mins'}</p>
            <p className="text-xs font-bold opacity-80 mt-4 max-w-[180px]">
              {status === 'active' ? 'Professionals is currently performing the service.' : 'Your professional is navigating to your portal.'}
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-[28px] flex items-center justify-center relative z-10">
            <Clock className={`w-10 h-10 text-white ${status === 'active' ? 'animate-spin-slow' : 'animate-pulse'}`} />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-[22px] flex items-center justify-center text-xl font-black text-white shadow-xl overflow-hidden border border-gray-100">
               {provider?.photoURL ? <img src={provider.photoURL} className="w-full h-full object-cover" /> : booking.providerName?.[0] || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-xl text-gray-900 truncate uppercase tracking-tight">{booking.providerName}</h3>
              <div className="flex items-center gap-1.5 bg-yellow-50 w-fit px-3 py-1 rounded-full border border-yellow-100 mt-1">
                <span className="text-yellow-600 text-[10px] font-black uppercase">Expert</span>
                <span className="text-yellow-400 font-black">★</span>
                <span className="text-yellow-600 font-black text-xs">{provider?.rating || '4.9'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => window.open(`tel:+${booking.providerPhone || booking.providerId}`)}
              className="flex-1 flex items-center justify-center gap-3 py-4 bg-gray-900 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-100 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4 fill-white" />
              Call Specialist
            </button>
            <button
              onClick={() => navigate(`/chat?providerId=${booking.providerId}&providerName=${booking.providerName}`)}
              className="w-16 h-16 flex items-center justify-center bg-gray-50 text-gray-400 rounded-[24px] border border-gray-100 active:scale-90 transition-all shrink-0"
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] p-6 mb-8 space-y-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/50">
               <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black mb-1 tracking-widest uppercase">Arrival Point</p>
              <p className="text-sm font-bold text-gray-900">{booking.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-50 rounded-2xl flex items-center justify-center shrink-0 border border-yellow-100/50">
               <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black mb-1 tracking-widest uppercase">Launch Window</p>
              <p className="text-sm font-bold text-gray-900">{booking.scheduledTime}</p>
            </div>
          </div>
        </div>

        <div className="px-2">
          <p className="text-[10px] font-black mb-6 text-gray-400 uppercase tracking-[0.3em]">Operational Status</p>
          <div className="space-y-8 relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-gray-100 -z-10" />
            
            <StatusItem 
              active={true} 
              completed={true} 
              label="Mission Confirmed" 
              desc="The service request has been verified." 
            />
            <StatusItem 
              active={status === 'accepted'} 
              completed={status === 'accepted' || status === 'active' || status === 'completed'} 
              label="Partner Engaged" 
              desc={`${booking.providerName} is now in transit.`} 
            />

            {/* Fake Interactive Live Map tracking logic */}
            {(status === 'accepted' || status === 'active') && (
               <div className="ml-8 mt-2 mb-6 h-40 bg-gray-100 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-inner relative group">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    title="Live Tracking Map"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=72.82%2C18.97%2C72.83%2C18.98&amp;layer=mapnik&amp;marker=18.975%2C72.825" 
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                    Live Global Positioning
                  </div>
               </div>
            )}

            <StatusItem 
              active={status === 'active'} 
              completed={status === 'completed'} 
              label="Service Execution" 
              desc="Work is currently underway." 
            />
            <StatusItem 
              active={status === 'completed'} 
              completed={status === 'completed'} 
              label="System Shutdown" 
              desc="The service quest is finalized." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ active, completed, label, desc }: any) {
  return (
    <div className="flex items-start gap-6">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all shrink-0 ${
        completed ? 'bg-green-500 shadow-lg shadow-green-100' : 
        active ? 'bg-blue-600 shadow-lg shadow-blue-100 animate-pulse' : 
        'bg-gray-100 border-4 border-white'
      }`}>
        {completed ? <CheckCircle className="w-5 h-5 text-white" /> : 
         active ? <div className="w-2 h-2 bg-white rounded-full" /> : 
         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />}
      </div>
      <div className="flex-1">
        <p className={`font-black uppercase tracking-tight ${completed || active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</p>
        <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">{desc}</p>
      </div>
    </div>
  );
}
