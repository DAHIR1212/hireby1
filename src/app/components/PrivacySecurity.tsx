import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, Bell, ChevronRight } from 'lucide-react';

export default function PrivacySecurity() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(true);
  const [showActivityStatus, setShowActivityStatus] = useState(true);

  const securityOptions = [
    {
      icon: Lock,
      title: 'Change Password',
      description: 'Update your account password',
      action: () => alert('Change password feature'),
    },
    {
      icon: Shield,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      action: () => alert('2FA setup'),
    },
    {
      icon: Eye,
      title: 'Login Activity',
      description: 'See where you are logged in',
      action: () => alert('Login activity'),
    },
  ];

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Privacy & Security</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Security</h2>
          <div className="space-y-1">
            {securityOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{option.title}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Privacy</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Get updates on your bookings</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  showNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    showNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="font-semibold">Activity Status</h3>
                  <p className="text-sm text-gray-600">Show when you are active</p>
                </div>
              </div>
              <button
                onClick={() => setShowActivityStatus(!showActivityStatus)}
                className={`w-12 h-7 rounded-full transition-colors ${
                  showActivityStatus ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    showActivityStatus ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">Data & Storage</h2>
          <button
            onClick={() => alert('Download your data')}
            className="w-full p-4 bg-gray-50 rounded-xl text-left"
          >
            <h3 className="font-semibold mb-1">Download Your Data</h3>
            <p className="text-sm text-gray-600">Get a copy of your information</p>
          </button>
        </div>
      </div>
    </div>
  );
}
