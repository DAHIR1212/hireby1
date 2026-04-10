import React from 'react';
import { useNavigate } from 'react-router';
import { Wrench, CheckCircle, Star, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-white">

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6">
          <Wrench className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-center">
          Welcome to HireBy
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-md">
          Connect with trusted professionals for all your service needs
        </p>

        <div className="w-full space-y-5 mb-8 max-w-md">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Verified Professionals</h3>
              <p className="text-sm text-gray-600">All service providers are background-checked</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Star className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Quality Service</h3>
              <p className="text-sm text-gray-600">Top-rated professionals at your service</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Secure Payment</h3>
              <p className="text-sm text-gray-600">Your payment is processed securely</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3 max-w-md mx-auto w-full">

        {/* ✅ Get Started → Login → OTP → Role Selection */}
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Get Started
        </button>

        {/* ✅ Already have account → Login → OTP → Home */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 font-bold"
          >
            Sign In
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-2">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}