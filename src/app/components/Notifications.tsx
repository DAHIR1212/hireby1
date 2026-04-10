import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, Trash2, CheckCheck } from 'lucide-react';
import BottomNav from './BottomNav.tsx';
import ProviderBottomNav from './ProviderBottomNav.tsx'; // Import ProviderNav
import { useNotifications } from '../context/NotificationContext.tsx';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications();
  const role = localStorage.getItem('userRole');

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return '📋';
      case 'payment': return '💰';
      case 'status': return '✨';
      case 'system': return '⚡';
      default: return '🔔';
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const seconds = Math.floor((new Date().getTime() - timestamp.toDate().getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
  };

  const handleNotifClick = async (notif: any) => {
    await markAsRead(notif.id);
    
    // Deep Linking logic
    if (notif.title.includes('Message')) {
      const meta = notif.metadata || {};
      const targetId = meta.providerId || meta.customerId;
      const targetName = meta.providerName || meta.customerName;
      
      if (targetId && targetName) {
        navigate(`/chat?${meta.providerId ? 'providerId' : 'customerId'}=${targetId}&${meta.providerName ? 'providerName' : 'customerName'}=${targetName}`);
      }
    } else if (notif.metadata?.bookingId) {
       navigate(`/booking-detail/${notif.metadata.bookingId}`);
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#F9FAFB]">

      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center active:scale-95 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex flex-col">
            <h1 className="font-black text-2xl tracking-tighter uppercase text-gray-900">Inbox</h1>
            {unreadCount > 0 && <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{unreadCount} New UPDATES</p>}
          </div>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center active:scale-95 transition-all"
            title="Mark all as read"
          >
            <CheckCheck className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 px-6 text-center">
            <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center shadow-sm ring-8 ring-gray-100/50">
              <Bell className="w-10 h-10 text-gray-200" />
            </div>
            <p className="font-black text-xl text-gray-900 uppercase tracking-tight">Silent for now</p>
            <p className="text-sm text-gray-400 font-medium max-w-[200px]">
              You'll get real-time mission updates and payment logs right here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`relative w-full p-6 rounded-[32px] flex items-start gap-5 transition-all shadow-sm border ${
                  !notif.read ? 'bg-white border-blue-100 ring-2 ring-blue-50/50' : 'bg-gray-50/50 border-gray-100 opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center text-3xl shrink-0 transition-colors ${
                  !notif.read ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-gray-400 border border-gray-100'
                }`}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`font-black text-lg tracking-tight uppercase ${!notif.read ? 'text-gray-900' : 'text-gray-400'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest shrink-0 mt-1">{getTimeAgo(notif.createdAt)}</p>
                  </div>
                  <p className={`text-sm font-bold leading-relaxed mb-1 ${!notif.read ? 'text-gray-600' : 'text-gray-400'}`}>
                    {notif.message}
                  </p>
                </div>
                
                {!notif.read && (
                  <div className="absolute top-6 right-6 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        {role === 'provider' ? <ProviderBottomNav /> : <BottomNav />}
      </div>
    </div>
  );
}