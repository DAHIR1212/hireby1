import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, markAsRead, clearAll } = useNotifications();

  return (
    <div className="size-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between px-6 py-6 bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight">System Alerts</h1>
        </div>
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="text-xs font-bold text-blue-600 uppercase tracking-widest"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 px-6 py-6 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Bell className="w-16 h-16 mb-4" />
            <p className="font-bold uppercase tracking-widest">No New Alerts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-5 rounded-2xl border ${!notif.read ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-100'} transition-all`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</h3>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <p className="text-sm text-gray-500 mb-2">{notif.message}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}