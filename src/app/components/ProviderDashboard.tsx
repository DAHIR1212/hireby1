import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, LogOut, Settings, CheckCircle, XCircle, Bell } from 'lucide-react';
import ProviderBottomNav from './ProviderBottomNav.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useBooking } from '../context/BookingContext.tsx';
import { useNotifications } from '../context/NotificationContext.tsx';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { currentUser, updateOnlineStatus } = useAuth();
  const { providerBookings, updateBookingStatus } = useBooking();
  const { unreadCount } = useNotifications();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // ✅ Real data from Firestore
  const providerName = currentUser?.name || localStorage.getItem('userName') || 'Provider';
  const providerPhoto = currentUser?.photo || localStorage.getItem('userPhoto');
  const firstName = providerName.split(' ')[0];

  // ✅ Real bookings
  const pendingBookings = providerBookings.filter(b => b.status === 'pending');
  const activeBookings = providerBookings.filter(b => b.status === 'accepted' || b.status === 'active');
  const completedBookings = providerBookings.filter(b => b.status === 'completed');
  
  // ✅ Calculate Earnings (Persistent from Firestore)
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (parseInt(b.price || '0') || 0), 0);
  
  const today = new Date().toLocaleDateString();
  const todayBookings = completedBookings.filter(b => {
    if (!b.updatedAt) return false;
    const date = b.updatedAt.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt);
    return date.toLocaleDateString() === today;
  });
  const todayEarnings = todayBookings.reduce((sum, b) => sum + (parseInt(b.price || '0') || 0), 0);

  const handleToggleOnline = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    await updateOnlineStatus(newStatus);
  };

  const handleAccept = async (booking: any) => {
    await updateBookingStatus(booking.id, 'accepted');
    navigate('/provider-jobs');
  };

  const handleDecline = async (booking: any) => {
    await updateBookingStatus(booking.id, 'cancelled');
  };

  const handleLogout = async () => {
    await updateOnlineStatus(false);
    localStorage.clear();
    navigate('/landing');
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-6 py-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 relative">
            <h1 className="text-lg font-bold">HireBy</h1>
            <div className="flex items-center gap-3">

              {/* Notification Bell */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-black"
              >
                {providerPhoto ? (
                  <img src={providerPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold">
                    {firstName[0]?.toUpperCase() || 'P'}
                  </div>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px] z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-sm">{providerName}</p>
                  <p className="text-xs text-gray-500">Service Provider</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-3 text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Welcome + Online Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome, {firstName}! 👋</h2>
              <p className="text-gray-600">{activeBookings.length} active jobs today</p>
            </div>
            <button
              onClick={handleToggleOnline}
              className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
            >
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-600 animate-pulse' : 'bg-gray-400'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </button>
          </div>

          {/* Earnings Card */}
          <button
            onClick={() => navigate('/provider-earnings')}
            className="w-full bg-black rounded-2xl p-6 text-white mb-6 text-left shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
               <div>
                  <p className="text-sm text-gray-400 mb-1 opacity-70 uppercase tracking-widest font-black">Today</p>
                  <p className="text-2xl font-black">₹{todayEarnings.toLocaleString()}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1 opacity-70 uppercase tracking-widest font-black">Total</p>
                  <p className="text-2xl font-black">₹{totalEarnings.toLocaleString()}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-widest">Active Jobs</p>
                <p className="text-xl font-black">
                  {activeBookings.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 mb-1 font-black uppercase tracking-widest">Completed</p>
                <p className="text-xl font-black">
                  {completedBookings.length}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-800">
              <span className="text-sm font-bold uppercase tracking-widest text-[10px] text-[#708090]">View Detailed Earnings</span>
              <ChevronRight className="w-4 h-4 text-[#708090]" />
            </div>
          </button>

          {/* Real-time New Requests */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              New Requests
              {pendingBookings.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingBookings.length}
                </span>
              )}
            </h3>
          </div>

          <div className="space-y-4 mb-8">
            {pendingBookings.length === 0 ? (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-semibold text-gray-700">No new requests</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  onClick={() => navigate(`/booking-detail/${booking.id}`)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm cursor-pointer hover:border-blue-200 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                      {booking.service?.toLowerCase().includes('clean') ? '🧹' : 
                       booking.service?.toLowerCase().includes('plumb') ? '🔧' : 
                       booking.service?.toLowerCase().includes('elect') ? '⚡' : '🔨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-extrabold text-gray-900 truncate">{booking.service}</h4>
                        <span className="bg-black text-white px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tighter">
                          NEW
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-bold mb-1 truncate">{booking.customerName}</p>
                      
                      <div className="flex flex-col gap-1">
                        {booking.address && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="text-red-400">📍</span>
                            <span className="truncate">{booking.address}</span>
                          </div>
                        )}
                        {booking.price && (
                          <div className="flex items-center gap-1.5 text-xs font-black text-green-600 mt-1">
                            <span>💰</span>
                            <span>Payout: ₹{booking.price}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleAccept(booking)}
                      className="flex-1 py-3 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(booking)}
                      className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Jobs & Payment Status */}
          {activeBookings.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-4">Jobs In Progress</h3>
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    onClick={() => navigate(`/booking-detail/${booking.id}`)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm border-l-4 border-l-blue-600"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900">{booking.service}</h4>
                        <p className="text-sm text-gray-600">{booking.customerName}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.paymentStatus === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                      <p className="text-sm font-bold text-blue-600">₹{booking.price}</p>
                      {booking.paymentStatus === 'paid' && (
                        <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             updateBookingStatus(booking.id, 'completed');
                          }}
                          className="bg-gray-900 text-white text-xs px-4 py-2 rounded-lg font-bold"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boost Card */}
          <button
            onClick={() => navigate('/active-job')}
            className="w-full bg-gray-100 rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold mb-1">Boost Your Visibility</p>
              <p className="text-sm text-gray-600">
                Upgrade to HireBy Premium for 2x more leads.
              </p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </button>

        </div>
      </div>
      <ProviderBottomNav />
    </div>
  );
}