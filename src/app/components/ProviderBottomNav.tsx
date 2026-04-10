import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Briefcase, Calendar, User } from 'lucide-react';

export default function ProviderBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/provider-dashboard' },
    { icon: Calendar, label: 'Jobs', path: '/provider-jobs' },
    { icon: Briefcase, label: 'Earnings', path: '/provider-earnings' },
    { icon: User, label: 'Profile', path: '/provider-profile-page' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <item.icon
                className={`w-6 h-6 ${
                  isActive ? 'text-black scale-110' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs font-black uppercase tracking-tighter ${
                  isActive ? 'text-black' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
