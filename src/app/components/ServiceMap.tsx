import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Search, Star, MessageSquare } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ServiceMap() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Real-time online providers
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'provider'),
      where('isOnline', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setProviders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB] relative overflow-hidden">
      {/* Search Header Overlay */}
      <div className="absolute top-12 left-6 right-6 z-20 space-y-4">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-100 active:scale-95 transition-all">
             <ArrowLeft className="w-6 h-6 text-gray-900" />
           </button>
           <div className="flex-1 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 italic font-black uppercase text-xs tracking-widest text-[#2563EB]">
             <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-ping" />
             Live Hero Radar
           </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-[32px] shadow-2xl flex items-center gap-4 border border-white/10 animate-in slide-in-from-top-4 duration-500">
           <div className="flex-1">
              <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-1">CURRENT SECTOR</p>
              <h3 className="text-white font-black text-xl leading-none uppercase tracking-tighter">Mission Control</h3>
           </div>
           <div className="px-4 py-2 bg-blue-600 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
             {providers.length} ACTIVE HEROES
           </div>
        </div>
      </div>

      {/* Simulated Map View (Real Data Pins) */}
      <div className="flex-1 bg-[#EEF2F5] relative">
         {/* Map Grid Lines */}
         <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
         
         {/* Live Pins */}
         {providers.map((p, idx) => (
           <div 
            key={p.id}
            onClick={() => navigate(`/provider-profile/${p.id}`)}
            className="absolute group animate-in fade-in zoom-in duration-500"
            style={{ 
              left: `${20 + (idx * 25) % 60}%`, 
              top: `${30 + (idx * 15) % 50}%` 
            }}
           >
             <div className="relative flex flex-col items-center">
               <div className="bg-white p-2 rounded-2xl shadow-2xl border-2 border-blue-600 scale-90 group-hover:scale-110 transition-transform cursor-pointer">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg overflow-hidden">
                    {p.photo ? <img src={p.photo} className="size-full object-cover" /> : p.name[0]}
                  </div>
               </div>
               <div className="mt-2 px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                 {p.name.split(' ')[0]}
               </div>
               <div className="w-1 h-3 bg-blue-600 -mt-1 rounded-full shadow-lg" />
             </div>
           </div>
         ))}

         {/* Empty State Overlay */}
         {!loading && providers.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm">
             <div className="max-w-xs">
                <div className="w-20 h-20 bg-gray-900 rounded-[28px] mx-auto mb-6 flex items-center justify-center text-3xl">📡</div>
                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic mb-2">SCANNING...</h4>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed"> No active hero signals detected in this sector. Recalibrating radar.</p>
             </div>
           </div>
         )}
      </div>

      {/* Hero Quick Scroll */}
      <div className="absolute bottom-10 left-0 right-0 overflow-x-auto pb-4 no-scrollbar px-6 flex gap-4 z-20">
         {providers.map((p) => (
           <div 
            key={p.id}
            onClick={() => navigate(`/provider-profile/${p.id}`)}
            className="w-72 bg-white rounded-[32px] p-5 shadow-2xl flex items-center gap-4 shrink-0 border border-gray-100 active:scale-95 transition-all"
           >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100 overflow-hidden">
                {p.photo ? <img src={p.photo} className="size-full object-cover" /> : p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                 <h4 className="font-black text-gray-900 leading-none truncate mb-1 uppercase tracking-tighter">{p.name}</h4>
                 <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{p.category || 'Specialist'}</p>
                 <div className="flex items-center gap-1 mt-1 text-yellow-500">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span className="text-[10px] font-black">{p.rating ? p.rating.toFixed(1) : 'New'}</span>
                    <span className="text-[9px] text-gray-400 font-bold ml-1">({p.ratingCount || 0})</span>
                 </div>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                 <MapPin className="w-5 h-5 text-gray-300" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
