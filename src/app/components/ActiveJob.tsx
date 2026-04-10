import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Phone, MessageSquare, CheckCircle, Navigation } from 'lucide-react';
import Header from './Header';
import { useProviderJobs } from '../context/ProviderJobsContext';

export default function ActiveJob() {
  const navigate = useNavigate();
  const { currentJob } = useProviderJobs();

  useEffect(() => {
    if (!currentJob) {
      navigate('/provider-dashboard');
    }
  }, [currentJob, navigate]);

  const handleComplete = () => {
    navigate('/job-complete', { state: { job: currentJob } });
  };

  if (!currentJob) {
    return null;
  }

  return (
    <div className="size-full flex flex-col bg-white">
      <Header title="HireBy" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="bg-black rounded-2xl p-6 text-white mb-6">
          <p className="text-sm text-gray-400 mb-2">ACTIVE JOB</p>
          <h2 className="text-2xl font-bold mb-4">{currentJob.service}</h2>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-600 font-semibold mb-3">CUSTOMER</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <p className="font-bold">{currentJob.customer}</p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-yellow-500">★</span>
                <span>4.8</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg font-semibold">
              <Phone className="w-5 h-5" />
              Call
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">LOCATION</p>
              <p className="font-semibold">{currentJob.location}</p>
              <p className="text-sm text-gray-600">{currentJob.locationDetail}</p>
            </div>
            <button className="p-2 bg-blue-100 rounded-lg">
              <Navigation className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-600 font-semibold mb-3">JOB DETAILS</p>
          <p className="text-gray-700 mb-4">
            {currentJob.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Reached customer location</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Job started</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
              <span>Job completed</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">YOUR EARNING</p>
              <p className="text-2xl font-bold text-green-600">₹{currentJob.amount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <button
          onClick={handleComplete}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold"
        >
          Mark as Complete
        </button>
      </div>
    </div>
  );
}
