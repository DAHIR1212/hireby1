import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Privacy Policy</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <p className="text-sm text-gray-500 mb-6">Last updated: October 2023</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Personal information (name, email, phone number)</li>
              <li>Location data for service delivery</li>
              <li>Payment information (processed securely)</li>
              <li>Service preferences and booking history</li>
              <li>Reviews and ratings you provide</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Facilitate service bookings and payments</li>
              <li>Connect you with verified service professionals</li>
              <li>Send booking confirmations and updates</li>
              <li>Improve our platform and services</li>
              <li>Provide customer support</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>With service providers to fulfill your booking</li>
              <li>With payment processors to complete transactions</li>
              <li>When required by law or legal process</li>
              <li>With your explicit consent</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              We never sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Location Data</h2>
            <p className="text-gray-700 leading-relaxed">
              We collect location data to match you with nearby service professionals and to facilitate service delivery. You can control location permissions through your device settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar technologies to improve your experience, analyze usage patterns, and personalize content. You can manage cookie preferences in your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and data at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for users under 18 years of age. We do not knowingly collect information from children.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-3 space-y-1 text-gray-700">
              <p><span className="font-semibold">Email:</span> privacy@hireby.com</p>
              <p><span className="font-semibold">Phone:</span> 1800-XXX-XXXX</p>
              <p><span className="font-semibold">Address:</span> Mumbai, Maharashtra, India</p>
            </div>
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
