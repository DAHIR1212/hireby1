import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export default function QuickHelp() {
  const navigate = useNavigate();
  const { topic } = useParams();

  const helpTopics: Record<string, { title: string; content: string[] }> = {
    'book-service': {
      title: 'How do I book a service?',
      content: [
        '1. Browse services on the home screen or use the search bar',
        '2. Select the service you need',
        '3. Choose your preferred date and time',
        '4. Select or add a service address',
        '5. Add any special instructions',
        '6. Review the price and proceed to payment',
        '7. Choose your payment method (UPI, Card, or Cash)',
        '8. Confirm booking and track your service'
      ]
    },
    'cancel-booking': {
      title: 'How to cancel a booking?',
      content: [
        '1. Go to "My Bookings" from the bottom navigation',
        '2. Select the booking you want to cancel',
        '3. Tap "View Details"',
        '4. Scroll down and tap "Cancel Booking"',
        '5. Confirm cancellation',
        '',
        'Note: Cancellations made more than 2 hours before the scheduled time are eligible for a full refund. Cancellations within 2 hours may incur charges.'
      ]
    },
    'become-provider': {
      title: 'How do I become a service provider?',
      content: [
        '1. On the landing screen, select "Service Provider" role',
        '2. Complete the registration form with your details',
        '3. Select your service categories and skills',
        '4. Upload required documents (ID proof, certificates)',
        '5. Complete background verification',
        '6. Set your availability and pricing',
        '7. Wait for admin approval (usually 24-48 hours)',
        '8. Start receiving job requests!',
        '',
        'Requirements:',
        '• Valid government ID',
        '• Proof of address',
        '• Relevant skill certificates (if applicable)',
        '• Bank account for payments'
      ]
    },
    'payment-refund': {
      title: 'Payment and refund policy',
      content: [
        'Payment Methods:',
        '• UPI (Google Pay, PhonePe, Paytm)',
        '• Credit/Debit Cards (Visa, Mastercard, RuPay)',
        '• Cash after service completion',
        '',
        'Refund Policy:',
        '• Free cancellation up to 2 hours before service',
        '• Cancellations within 2 hours: 50% refund',
        '• No-show by provider: Full refund + compensation',
        '• Refunds processed within 5-7 business days',
        '',
        'Payment Security:',
        'All online payments are encrypted and processed through secure payment gateways. We never store your card details.'
      ]
    },
    'rate-service': {
      title: 'How to rate a service?',
      content: [
        '1. After service completion, you\'ll receive a notification',
        '2. Go to "My Bookings" and find the completed service',
        '3. Tap "Rate This Service"',
        '4. Select star rating (1-5 stars)',
        '5. Write a detailed review (optional)',
        '6. Add photos of the work done (optional)',
        '7. Submit your review',
        '',
        'Your reviews help:',
        '• Other users make informed decisions',
        '• Service providers improve their quality',
        '• Build trust in the HireBy community'
      ]
    }
  };

  const currentTopic = helpTopics[topic || 'book-service'];

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-base">Help</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">{currentTopic.title}</h2>

        <div className="space-y-4">
          {currentTopic.content.map((line, index) => (
            <p key={index} className={`text-gray-700 leading-relaxed ${line === '' ? 'mt-2' : ''} ${line.startsWith('•') || line.match(/^\d+\./) ? 'ml-2' : ''}`}>
              {line}
            </p>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-bold mb-2">Still need help?</h3>
          <p className="text-sm text-gray-700 mb-3">
            Contact our support team for personalized assistance
          </p>
          <button
            onClick={() => navigate('/help-support')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
