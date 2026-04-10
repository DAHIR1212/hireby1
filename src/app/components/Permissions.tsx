import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, FolderOpen, ShieldCheck, XCircle, CheckCircle2, Navigation } from 'lucide-react';

export default function Permissions({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1); // 1 = Location, 2 = Storage
  const [denied, setDenied] = useState(false);

  const handleAllow = (type: 'always' | 'use' | 'deny') => {
    if (type === 'deny') {
      setDenied(true);
      return;
    }
    
    // In a real app, you'd trigger navigator.geolocation.getCurrentPosition here
    
    if (step === 1) {
      setStep(2);
    } else {
      localStorage.setItem('permissions_granted', 'true');
      onComplete();
    }
  };

  if (denied) {
    return (
      <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-200">
        <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center mb-8 border border-red-500/20">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-4">ACCESS DENIED</h2>
        <p className="text-gray-400 font-bold leading-relaxed mb-12">
          Tracking features require operational clearance. The HireBy application has been locked for security. Please relaunch and grant permissions.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all text-sm"
        >
          Retry Authorization
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col p-8 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto text-center">
        
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-blue-100 rounded-[40px] blur-3xl opacity-50 animate-pulse" />
           <div className="relative w-28 h-28 bg-gray-900 rounded-[32px] flex items-center justify-center shadow-2xl shadow-blue-100 border border-white/10">
             {step === 1 ? (
               <MapPin className="w-12 h-12 text-blue-400" />
             ) : (
               <FolderOpen className="w-12 h-12 text-blue-400" />
             )}
           </div>
           <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
             <ShieldCheck className="w-5 h-5 text-white" />
           </div>
        </div>

        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4">System Protocol 117-B</p>
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none mb-4">
          Requesting {step === 1 ? 'Location' : 'Storage'} Access
        </h2>
        <p className="text-sm font-bold text-gray-400 leading-relaxed">
          {step === 1 
            ? "To enable elite precision tracking and real-time mission updates, the HireBy registry requires your current coordinates." 
            : "To capture job logs, service snapshots, and operational receipts across sessions, storage clearance is required."}
        </p>

        <div className="w-full h-px bg-gray-100 my-10" />

        <div className="w-full space-y-4">
          <button 
            onClick={() => handleAllow('always')}
            className={`w-full py-5 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center justify-between px-8 border transition-all active:scale-[0.98] ${
              step === 1 ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            Allow
            <CheckCircle2 className="w-4 h-4 opacity-50" />
          </button>
          
          <button 
            onClick={() => handleAllow('use')}
            className="w-full py-5 bg-gray-50 text-gray-900 border border-gray-100 rounded-[22px] font-black text-xs uppercase tracking-widest px-8 flex items-center justify-between active:scale-[0.98] transition-all"
          >
            Allow while using app
            <Navigation className="w-4 h-4 opacity-30 px-0.5" />
          </button>
          
          <button 
            onClick={() => handleAllow('deny')}
            className="w-full py-5 bg-white text-red-500 border border-red-50 rounded-[22px] font-black text-xs uppercase tracking-widest px-8 hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            Don't Allow
          </button>
        </div>
      </div>

      <div className="text-center pb-10">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic pt-12">
          HireBy Trusted Registry • 2026 Secured Operations
        </p>
      </div>
    </div>
  );
}
