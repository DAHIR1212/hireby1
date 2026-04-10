import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, MapPin, Bell, Shield, HelpCircle, LogOut, ChevronRight, Heart, Settings, Star } from 'lucide-react';
import BottomNav from './BottomNav.tsx';
import ProviderBottomNav from './ProviderBottomNav.tsx';
import { useTranslation } from '../hooks/useTranslation.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { updateOnlineStatus } = useAuth();
  
  const [providerData, setProviderData] = useState<any>(null);

  // ✅ Get real user data from localStorage
  const userName = localStorage.getItem('userName') || 'John Doe';
  const userPhone = localStorage.getItem('userPhone') || '';
  const userLocation = localStorage.getItem('userLocation') || '';
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole === 'provider' && userPhone) {
      getDoc(doc(db, 'users', userPhone)).then(snap => {
        if (snap.exists()) setProviderData(snap.data());
      });
    }
  }, [userRole, userPhone]);

  const handleLogout = async () => {
    // ✅ Set offline before leaving
    await updateOnlineStatus(false);
    // ✅ Clear all user data
    localStorage.clear();
    navigate('/landing');
  };

  const menuItems = [
    { icon: User, label: t('editProfile'), action: () => navigate('/edit-profile') },
    ...(userRole === 'provider' 
      ? [
          { icon: Heart, label: 'Skill Selection', action: () => navigate('/provider-skill-selection') },
        ]
      : [
          { icon: Heart, label: 'Favorites', action: () => navigate('/favorites') },
        ]
    ),
    { icon: MapPin, label: t('manageAddresses'), action: () => navigate('/manage-addresses') },
    { icon: Bell, label: t('notifications'), action: () => navigate('/notifications') },
    { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
    { icon: Shield, label: t('privacySecurity'), action: () => navigate('/privacy-security') },
    { icon: HelpCircle, label: t('helpSupport'), action: () => navigate('/help-support') },
  ];

  return (
    <div className="size-full flex flex-col bg-white">

      {/* ✅ Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-3xl font-bold">{t('profile')}</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
            {(['EN', 'HI', 'GU'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  language === lang 
                    ? 'bg-white text-blue-600 shadow-xl scale-105' 
                    : 'text-gray-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-6">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {userName[0]?.toUpperCase() || 'J'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{userName}</h3>
              {userPhone && (
                <p className="text-gray-600">+91 {userPhone}</p>
              )}
              {userRole === 'provider' && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-sm font-semibold">{providerData?.rating ? providerData.rating.toFixed(1) : 'New'}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-tight ml-1">({providerData?.ratingCount || 0})</span>
                </div>
              )}
              {userLocation && (
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1 font-medium italic">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {userLocation}
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="text-blue-600 font-semibold text-sm"
            >
              {t('editProfile')}
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 mb-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-600" />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('logout')}
          </button>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>HireBy v2.4.1</p>
            <p className="mt-2">
              <button onClick={() => navigate('/terms')} className="text-blue-600">{t('termsOfService')}</button>
              {' • '}
              <button onClick={() => navigate('/privacy-policy')} className="text-blue-600">{t('privacyPolicy')}</button>
            </p>
          </div>
        </div>
      </div>

      {userRole === 'provider' ? <ProviderBottomNav /> : <BottomNav />}
    </div>
  );
}