import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CheckCircle, Star, Camera, Download } from 'lucide-react';
import Header from './Header';
import { useProviderJobs } from '../context/ProviderJobsContext';

export default function JobComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeJob, currentJob } = useProviderJobs();
  const hasCompleted = useRef(false);

  const job = location.state?.job || currentJob;

  useEffect(() => {
    if (job && !hasCompleted.current) {
      completeJob(job.id, 5, 'Excellent work! Very professional and fixed the leak quickly. Highly recommend!');
      hasCompleted.current = true;
    }
  }, [job, completeJob]);

  return (
    <div className="size-full flex flex-col bg-white">
      <Header title="HireBy" />

      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Job Completed!</h2>
          <p className="text-gray-600 text-center">Great work on completing this service</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-600 font-semibold mb-3">JOB SUMMARY</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Service</span>
              <span className="font-semibold">{job?.service || 'Pipe Leakage Repair'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Customer</span>
              <span className="font-semibold">{job?.customer || 'Rahul Sharma'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-semibold">{job?.duration || '1 hour 15 mins'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completed At</span>
              <span className="font-semibold">{job?.completedTime || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl p-4 mb-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Base Amount</span>
            <span className="font-semibold">₹{job?.amount || 450}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-600">Platform Fee</span>
            <span className="font-semibold text-red-600">- ₹{Math.round((job?.amount || 450) * 0.1)}</span>
          </div>
          <div className="border-t border-green-200 pt-3 flex items-center justify-between">
            <span className="font-bold">Your Earnings</span>
            <span className="text-2xl font-bold text-green-600">₹{Math.round((job?.amount || 450) * 0.9)}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-gray-600 font-semibold mb-3">ADD PHOTOS</p>
          <p className="text-sm text-gray-600 mb-4">Upload before and after photos of your work</p>
          <div className="grid grid-cols-3 gap-2">
            <button className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-6 h-6 text-gray-400" />
            </button>
            <button className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-6 h-6 text-gray-400" />
            </button>
            <button className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs text-gray-600 font-semibold mb-3">CUSTOMER FEEDBACK</p>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <p className="text-gray-700 italic">
            "Excellent work! Very professional and fixed the leak quickly. Highly recommend!"
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-900 py-4 rounded-lg font-semibold">
            <Download className="w-5 h-5" />
            Invoice
          </button>
          <button
            onClick={() => navigate('/provider-jobs')}
            className="flex-1 bg-blue-600 text-white py-4 rounded-lg font-semibold"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
