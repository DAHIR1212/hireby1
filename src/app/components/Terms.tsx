import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Terms of Service</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="text-sm text-gray-500 mb-6">Last updated: October 2023</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using HireBy's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Service Description</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              HireBy provides a platform that connects customers with local service professionals. We facilitate bookings and payments but do not directly provide the services themselves.
            </p>
            <p className="text-gray-700 leading-relaxed">
              All service providers on our platform are independent contractors and not employees of HireBy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Treat service providers with respect and courtesy</li>
              <li>Pay for services as agreed upon booking</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Booking and Cancellation</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Bookings are confirmed once payment is processed. Cancellations made more than 2 hours before the scheduled service time are eligible for a full refund.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cancellations within 2 hours of service time may incur cancellation fees as per our policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Payment Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              All payments are processed securely through our payment gateway partners. Prices displayed include applicable taxes unless otherwise stated. Payment methods include UPI, credit/debit cards, and cash.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              HireBy acts as an intermediary platform. While we verify service providers, we are not liable for the quality of services provided. Any disputes should be resolved directly with the service provider.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content, trademarks, and intellectual property on the HireBy platform are owned by or licensed to HireBy. Unauthorized use is prohibited.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of HireBy is also governed by our Privacy Policy. Please review our Privacy Policy to understand our data practices.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">9. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              HireBy reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at legal@hireby.com or call our toll-free number 1800-XXX-XXXX.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2026 HireBy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
