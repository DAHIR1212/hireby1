import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from '../hooks/useTranslation.ts';
import Permissions from './Permissions.tsx';

export default function Splash() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showPermissions, setShowPermissions] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ✅ Keep sessions alive. Only clear if version is extremely old (optional)
    const appVersion = localStorage.getItem('appVersion');
    if (appVersion !== '2.4.1') { // Updated to current version
      // Don't clear EVERYTHING, just keep it or clear old keys if needed
      localStorage.setItem('appVersion', '2.4.1');
    }

    const timer = setTimeout(() => {
      // Check if permissions already granted
      const granted = localStorage.getItem('permissions_granted');
      if (!granted) {
        setShowPermissions(true);
      } else {
        setIsReady(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const navTimer = setTimeout(() => {
      const userPhone = localStorage.getItem('userPhone');
      const userName = localStorage.getItem('userName');
      const userRole = localStorage.getItem('userRole');

      // ✅ If phone is there, user is logged in
      if (userPhone) {
        // If profile is missing name, take them to setup
        if (!userName) {
          if (!userRole) {
            navigate('/role-selection');
          } else {
            navigate('/profile-setup');
          }
          return;
        }

        // Direct to dashboards
        if (userRole === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/home');
        }
        return;
      }

      // Not logged in — check onboarding
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/landing');
      }
    }, 500);

    return () => clearTimeout(navTimer);
  }, [isReady, navigate]);

  if (showPermissions) {
    return <Permissions onComplete={() => {
       setShowPermissions(false);
       setIsReady(true);
    }} />;
  }

  return (
    <div className="size-full flex flex-col items-center justify-center bg-gray-50 relative">

      {/* ✅ Reset button for testing */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/landing';
        }}
        className="absolute top-4 right-4 text-xs text-gray-400 px-3 py-1 bg-gray-100 rounded-full"
      >
        Reset
      </button>

      <div className="flex flex-col items-center gap-6">
        <div className="w-32 h-32 bg-gray-900 rounded-3xl flex items-center justify-center shadow-lg">
          <span className="text-white text-5xl font-bold">HB</span>
        </div>
        <h1 className="text-5xl font-bold text-gray-900">HireBy</h1>
        <p className="text-gray-500 text-lg text-center px-6">
          {t('appTagline')}
        </p>
      </div>

      <div className="absolute bottom-16 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-900"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>
    </div>
  );
}