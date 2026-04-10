import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { UserCheck, Wrench, ChevronRight, Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { db } from '../firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'EN' as const, name: 'English' },
    { code: 'HI' as const, name: 'हिंदी' },
    { code: 'GU' as const, name: 'ગુજરાતી' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageMenu]);

  const handleRoleSelect = async (role: 'customer' | 'provider') => {
    setLoading(true);

    try {
      // ✅ Save role to localStorage
      localStorage.setItem('userRole', role);

      // ✅ Save role to Firestore
      const phone = localStorage.getItem('userPhone');
      if (phone) {
        const userRef = doc(db, 'users', phone);
        await updateDoc(userRef, {
          role,
          updatedAt: new Date().toISOString(),
        });
      }

      // ✅ Navigate based on role
      if (role === 'customer') {
        navigate('/profile-setup'); // Customer → fill name/photo
      } else {
        navigate('/provider-onboarding'); // Provider → onboarding → skills
      }

    } catch (err) {
      console.error(err);
      // Navigate anyway even if Firestore fails
      if (role === 'customer') {
        navigate('/profile-setup');
      } else {
        navigate('/provider-onboarding');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="size-full flex flex-col bg-white">

      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100 relative" ref={menuRef}>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">HireBy</h1>
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">
              {languages.find(l => l.code === language)?.name || 'English'}
            </span>
          </button>
        </div>

        {/* Language Menu */}
        {showLanguageMenu && (
          <div className="absolute right-6 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[150px] overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowLanguageMenu(false);
                }}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${language === lang.code
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700'
                  }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mb-8">
          <p className="text-blue-600 text-sm font-bold mb-2 tracking-wider">
            {t('continueAs')}
          </p>
          <h2 className="text-3xl font-bold">{t('chooseYourRole')}</h2>
          <p className="text-gray-500 text-sm mt-2">
            Choose how you want to use HireBy
          </p>
        </div>

        <div className="space-y-4">

          {/* Customer Button */}
          <button
            onClick={() => handleRoleSelect('customer')}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <UserCheck className="w-7 h-7 text-blue-600" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('customer')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('customerDesc')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">Book Services</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">Track Bookings</span>
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">Rate Providers</span>
            </div>
          </button>

          {/* Provider Button */}
          <button
            onClick={() => handleRoleSelect('provider')}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-6 text-left hover:border-green-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <Wrench className="w-7 h-7 text-green-600" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('serviceProvider')}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('serviceProviderDesc')}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Earn Money</span>
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Manage Jobs</span>
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">Grow Business</span>
            </div>
          </button>

        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center mt-6 gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Saving your choice...</p>
          </div>
        )}
      </div>
    </div>
  );
}