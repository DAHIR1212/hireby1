import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Wrench, Calendar, User } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation.ts';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/services' && location.pathname === '/search-results') return true;
    return location.pathname === path;
  };

  const navItems = [
    { path: '/home', icon: Home, labelKey: 'home' as const },
    { path: '/services', icon: Wrench, labelKey: 'services' as const },
    { path: '/my-bookings', icon: Calendar, labelKey: 'bookings' as const },
    { path: '/profile', icon: User, labelKey: 'profile' as const },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center px-4 py-3 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, labelKey }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 ${
              isActive(path) ? 'text-black scale-110' : 'text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
