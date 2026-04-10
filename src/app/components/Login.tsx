import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../api.ts';

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidPhone = phone.length === 10 && /^\d{10}$/.test(phone);

  const handleContinue = () => {
    if (!isValidPhone) return;
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      navigate('/otp-verification', { state: { phone } });
    }, 1000);
  };

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="mb-8">
          <h1 className="text-lg font-bold">HireBy</h1>
        </div>

        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-gray-600 mb-8">
          Enter your phone number to continue
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              PHONE NUMBER
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-lg">
                <span className="font-semibold">+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 10) setPhone(value);
                }}
                placeholder="9876543210"
                maxLength={10}
                className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleContinue}
          disabled={!isValidPhone || loading}
          className={`w-full py-4 rounded-lg font-semibold transition-colors ${isValidPhone && !loading
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? 'Sending OTP...' : 'Continue'}
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}