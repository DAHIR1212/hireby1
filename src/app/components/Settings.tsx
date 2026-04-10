import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Bell, Globe, Moon, ChevronRight, Smartphone, Download, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'EN' as const, name: 'English' },
    { code: 'HI' as const, name: 'हिंदी' },
    { code: 'GU' as const, name: 'ગુજરાતી' },
  ];

  // ✅ Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };
    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLanguageMenu]);

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-3 text-gray-700">PREFERENCES</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            {/* Notifications */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-xs text-gray-600">Receive booking updates</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Language */}
            <div className="relative" ref={languageMenuRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="font-semibold">Language</p>
                    <p className="text-xs text-gray-600">
                      {languages.find(l => l.code === language)?.name || 'English'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* ✅ Fixed dropdown */}
              {showLanguageMenu && (
                <div className="absolute left-4 right-4 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${language === lang.code ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                        }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold">Dark Mode</p>
                  <p className="text-xs text-gray-600">Switch theme</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`w-12 h-7 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-3 text-gray-700">APP INFO</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => alert('You are on the latest version!')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold">App Version</p>
                  <p className="text-xs text-gray-600">v2.4.1 (Latest)</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <p className="font-semibold">About HireBy</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Data & Storage */}
        <div className="mb-6">
          <h2 className="text-sm font-bold mb-3 text-gray-700">DATA & STORAGE</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => alert('Downloading your data...')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold">Download Your Data</p>
                  <p className="text-xs text-gray-600">Export all your information</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => {
                if (confirm('Clear cache and temporary files?')) {
                  alert('Cache cleared!');
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="font-semibold">Clear Cache</p>
                  <p className="text-xs text-gray-600">Free up 24 MB</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h2 className="text-sm font-bold mb-3 text-gray-700">LEGAL</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => navigate('/terms')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
            >
              <p className="font-semibold">Terms of Service</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => navigate('/privacy-policy')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <p className="font-semibold">Privacy Policy</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">HireBy v2.6.1</p>
          <p className="text-xs text-gray-400">Made with ❤️ in India</p>
        </div>
      </div>
    </div>
  );
}