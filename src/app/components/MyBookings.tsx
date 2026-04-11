import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Calendar, Clock, Star, MapPin, Trash2, ArrowRight, Activity, CreditCard, ChevronRight } from 'lucide-react';
import BottomNav from './BottomNav';
import { useBooking, Booking } from '../context/BookingContext.tsx';

export default function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'active');
  const { myBookings, deleteBooking } = useBooking();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  console.log('[DEBUG] MyBookings Source:', myBookings);
  console.log('[DEBUG] Active Tab:', activeTab);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Waitlist', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' };
      case 'accepted': return { label: 'Confirmed', color: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'active': return { label: 'In Progress', color: 'bg-green-50 text-green-600 border-green-100' };
      case 'completed': return { label: 'Completed', color: 'bg-gray-50 text-gray-400 border-gray-100' };
      case 'cancelled': 
      case 'declined': return { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-100' };
      default: return { label: status.toUpperCase(), color: 'bg-gray-100 text-gray-500 border-gray-200' };
    }
  };

  const getServiceIcon = (service: string) => {
    const s = service?.toLowerCase() || '';
    if (s.includes('clean')) return '🧹';
    if (s.includes('plumb')) return '🔧';
    if (s.includes('elect')) return '⚡';
    if (s.includes('paint')) return '🎨';
    if (s.includes('ac')) return '❄️';
    if (s.includes('carp')) return '🪚';
    return '🔨';
  };

  const getTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Permanently remove this booking from your history?')) {
      setDeletingId(id);
      try {
        await deleteBooking(id);
      } catch (err) {
        console.error(err);
        alert('Failed to delete');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filtered = myBookings.filter(b => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return b.status === 'pending' || b.status === 'accepted' || b.status === 'active';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled' || b.status === 'declined';
    return true;
  });

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 bg-white sticky top-0 z-20">
        <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">My Bookings</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {[
            { label: 'All', key: 'all' },
            { label: 'Active', key: 'active' },
            { label: 'Completed', key: 'completed' },
            { label: 'Cancelled', key: 'cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-2xl whitespace-nowrap font-black text-[10px] uppercase tracking-widest transition-all ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 scale-105'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {tab.label}
              {tab.key === 'active' && myBookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'active').length > 0 && (
                <span className="ml-2 bg-blue-500 text-white px-2 py-0.5 rounded-full text-[9px]">
                  {myBookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'active').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 space-y-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm ring-8 ring-gray-50/50">📋</div>
            <p className="font-black text-xl text-gray-900 uppercase tracking-tight">No adventures yet</p>
            <p className="text-gray-400 mt-2 font-medium max-w-[240px]">Your booked services will appear here once you start exploring.</p>
          </div>
        ) : (
          filtered.map((booking) => {
            const status = getStatusDisplay(booking.status);
            return (
              <div
                key={booking.id}
                onClick={() => navigate(`/booking-detail/${booking.id}`)}
                className={`group relative bg-white border border-gray-100 rounded-[36px] p-6 shadow-sm transition-all hover:shadow-md active:scale-[0.98] ${
                  deletingId === booking.id ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-16 h-16 bg-gray-50 rounded-[24px] flex items-center justify-center text-4xl shadow-inner border border-gray-100 group-hover:bg-blue-50 transition-colors">
                    {getServiceIcon(booking.service)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="font-black text-xl text-gray-900 truncate uppercase tracking-tighter">
                        {booking.service}
                      </h3>
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-widest">BY {booking.providerName}</p>
                    
                    {booking.status === 'active' && (
                      <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-[0.2em] bg-green-50 px-3 py-1.5 rounded-full w-fit">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        Live Progress
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-[28px] p-5 space-y-4 mb-6 border border-gray-100/50">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{getTime(booking.createdAt)}</span>
                    </div>
                    <p className="text-gray-900 font-black text-sm">₹{booking.price}</p>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-bold text-gray-400">
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="truncate">{booking.address}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {/* Action Buttons */}
                  <div className="flex-1 flex gap-3">
                    {booking.status === 'completed' && booking.paymentStatus !== 'paid' ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/payment?bookingId=${booking.id}`); }}
                        className="flex-1 py-4 bg-green-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay Specialist
                      </button>
                    ) : (booking.status === 'active' || booking.status === 'accepted') ? (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/booking-detail/${booking.id}`); }}
                          className="flex-1 py-4 bg-gray-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1"
                        >
                          Manage
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/booking-tracking?bookingId=${booking.id}`); }}
                          className="flex-1 py-4 bg-[#2563EB] text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
                        >
                          <MapPin className="w-4 h-4" />
                          Track
                        </button>
                      </>
                    ) : booking.status === 'completed' && !booking.rated ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/rate-service/${booking.id}`); }}
                        className="flex-1 py-4 bg-yellow-400 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        Rate & Review
                      </button>
                    ) : (
                      <div className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-[20px] font-black text-[10px] uppercase tracking-widest text-center border border-gray-100 italic">
                         Archived Record
                      </div>
                    )}
                  </div>

                  {/* Only allow deletion if mission is cancelled, declined, or PAID completed */}
                  {(booking.status === 'cancelled' || booking.status === 'declined' || (booking.status === 'completed' && booking.paymentStatus === 'paid')) && (
                    <button
                      onClick={(e) => handleDelete(e, booking.id)}
                      className="w-14 h-14 bg-gray-50 text-gray-400 rounded-[24px] flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100 group-hover:border-red-100 shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}