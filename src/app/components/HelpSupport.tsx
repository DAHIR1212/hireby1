import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MessageCircle, Phone, Mail, FileText, ChevronRight, HelpCircle } from 'lucide-react';

export default function HelpSupport() {
  const navigate = useNavigate();

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () => navigate('/chat'),
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: '+91 1800-123-4567 (Toll free)',
      action: () => {
        window.location.href = 'tel:+911800123456 7';
      },
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@hireby.com',
      action: () => {
        window.location.href = 'mailto:support@hireby.com';
      },
    },
    {
      icon: FileText,
      title: 'FAQs',
      description: 'Find answers to common questions',
      action: () => navigate('/quick-help/book-service'),
    },
  ];

  const quickHelp = [
    { title: 'How do I book a service?', slug: 'book-service' },
    { title: 'How to cancel a booking?', slug: 'cancel-booking' },
    { title: 'How do I become a service provider?', slug: 'become-provider' },
    { title: 'Payment and refund policy', slug: 'payment-refund' },
    { title: 'How to rate a service?', slug: 'rate-service' },
  ];

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Help & Support</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Contact Us</h2>
          <div className="space-y-1">
            {supportOptions.map((option, index) => (
              <button
                key={index}
                onClick={option.action}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-blue-600" />
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
          <h2 className="text-lg font-bold mb-4">Quick Help</h2>
          <div className="space-y-2">
            {quickHelp.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(`/quick-help/${item.slug}`)}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <span className="flex-1 font-medium">{item.title}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-bold mb-2">Need immediate help?</h3>
          <p className="text-sm text-gray-700 mb-4">
            Our support team is available 24/7 to assist you
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );
}
