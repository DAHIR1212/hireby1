import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, MapPin, Phone, MessageSquare, CheckCircle, Star, Play, Square, Activity, CreditCard } from 'lucide-react';
import ProviderBottomNav from './ProviderBottomNav';
import { useBooking, Booking } from '../context/BookingContext';

export default function ProviderJobs() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const { providerBookings, updateBookingStatus, updateBooking } = useBooking();
  const [tick, setTick] = useState(0);



  const activeJobs = providerBookings.filter(b => b.status === 'accepted' || b.status === 'active');
  const completedJobs = providerBookings.filter(b => b.status === 'completed');

  const getDurationString = (startTime: string) => {
    if (!startTime) return '0m';
    const diffMs = Date.now() - new Date(startTime).getTime();
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="size-full flex flex-col bg-white pb-20">
      <div className="px-6 pt-12 pb-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <h1 className="font-black text-2xl tracking-tighter uppercase text-gray-900">Mission Logs</h1>
        <div className="px-3 py-1 bg-gray-100 rounded-full border border-gray-200">
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Provider Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex gap-2 mb-8">
          {['Active', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.toLowerCase()
                  ? 'bg-gray-900 text-white shadow-2xl shadow-gray-200 scale-[1.02]'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'active' && (
          <div className="space-y-6">
            {activeJobs.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center gap-4 text-gray-400">
                <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center text-4xl shadow-sm border border-gray-100">📡</div>
                <p className="font-black uppercase tracking-tight text-gray-900">No active signal</p>
                <p className="text-xs font-medium max-w-[180px]">Accept a quest from the dashboard to begin logs.</p>
              </div>
            ) : (
              activeJobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:border-blue-100 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-black text-2xl mb-1 text-gray-900 leading-none truncate max-w-[150px]">{job.service}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-xs font-black text-white shadow-xl shadow-black/10">
                          {job.customerName?.[0]}
                        </div>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-tight">{job.customerName}</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        job.status === 'active'
                          ? 'bg-black text-white border-black'
                          : 'bg-gray-50 text-gray-600 border-gray-100'
                      }`}
                    >
                      {job.status === 'active' ? '● LIVE WORK' : 'READY TO START'}
                    </span>
                  </div>

                  {job.status === 'active' && job.startTime && (
                    <div className="bg-black rounded-[28px] p-6 mb-6 flex items-center justify-between text-white shadow-2xl shadow-gray-300">
                      <div>
                        <p className="text-[10px] font-black opacity-50 tracking-[0.2em] mb-1 uppercase">EST. VALUE</p>
                        <p className="text-3xl font-black text-white">₹{job.price}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-50">
                       <Clock className="w-4 h-4 text-blue-600 mb-2" />
                       <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Schedule</p>
                       <p className="text-xs font-black text-gray-900">{job.scheduledTime}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-50 min-w-0">
                       <MapPin className="w-4 h-4 text-red-500 mb-2" />
                       <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Location</p>
                       <p className="text-xs font-black text-gray-900 truncate">{job.address}</p>
                    </div>
                  </div>

                  {/* Payment Indicator */}
                  <div className="mb-6 flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment Status</p>
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${job.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                      {job.paymentStatus === 'paid' ? 'FUNDED' : 'AWAITING AUTH'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1 flex gap-2">
                    {/* Status Indicators (Control is Client-Side Only) */}
                    {job.status === 'accepted' ? (
                      <div className="flex-1 py-4.5 bg-blue-50 text-blue-600 rounded-[22px] font-black text-[10px] uppercase tracking-widest text-center border border-blue-100 flex items-center justify-center gap-2">
                        <Activity className="w-4 h-4 animate-pulse" />
                        Awaiting Client to Start
                      </div>
                    ) : (
                      <>
                        {!job.endTime ? (
                          <div className="flex-1 py-4.5 bg-green-50 text-green-600 rounded-[22px] font-black text-[10px] uppercase tracking-widest text-center border border-green-100 flex items-center justify-center gap-2">
                            <Activity className="w-4 h-4 animate-pulse" />
                            Work in Progress (Live)
                          </div>
                        ) : job.paymentStatus === 'paid' ? (
                          <button
                            onClick={() => updateBookingStatus(job.id, 'completed')}
                            className="flex-1 py-4.5 bg-gray-900 text-white rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-gray-200"
                          >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            Finalize Request
                          </button>
                        ) : (
                          <div className="flex-1 py-4.5 bg-orange-50 text-orange-600 rounded-[22px] font-black text-[10px] uppercase tracking-widest text-center border border-orange-100 flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Waiting for Payment
                          </div>
                        )}
                      </>
                    )}
                    </div>

                    <div className="flex gap-2 w-full">
                       <button
                        onClick={() => window.location.href = `tel:+91${job.customerPhone}`}
                        className="w-full h-14 bg-black text-white border border-black rounded-[22px] flex items-center justify-center active:scale-95 transition-all shadow-xl shadow-black/10"
                      >
                        <Phone className="w-5 h-5 fill-white" />
                        <span className="ml-2 font-black text-xs uppercase tracking-widest">Call Customer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedJobs.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-semibold">No finished business yet</div>
            ) : (
              completedJobs.map((job) => (
                <div key={job.id} className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1 text-gray-900">{job.service}</h3>
                      <p className="text-sm font-medium text-gray-500">To {job.customerName}</p>
                    </div>
                    <span className="px-3 py-1 bg-white text-gray-500 border border-gray-100 rounded-full text-[10px] font-black uppercase">
                      CLOSED
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (job.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xl font-black text-gray-900">₹{job.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ProviderBottomNav />
    </div>
  );
}
