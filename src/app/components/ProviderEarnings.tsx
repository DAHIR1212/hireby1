import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, CreditCard, Download } from 'lucide-react';
import ProviderBottomNav from './ProviderBottomNav';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function ProviderEarnings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const phone = localStorage.getItem('userPhone') || '';
  const providerName = localStorage.getItem('userName') || 'Provider';

  useEffect(() => {
    if (!phone) return;

    // ✅ Real bookings from Firestore
    const q = query(
      collection(db, 'bookings'),
      where('providerId', '==', phone),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));
      setBookings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [phone]);

  // ✅ Real calculations
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'accepted' || b.status === 'active');

  const totalEarnings = completedBookings.reduce((sum, b) => {
    return sum + (parseInt(b.price || '0') || 0);
  }, 0);

  const pendingEarnings = activeBookings.reduce((sum, b) => {
    return sum + (parseInt(b.price || '0') || 0);
  }, 0);

  const avgPerJob = completedBookings.length > 0
    ? Math.round(totalEarnings / completedBookings.length)
    : 0;

  const getTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="size-full flex flex-col bg-white">

      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-2 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-lg">Earnings</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">

        {/* Total Earnings Card */}
        <div className="px-6 py-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <p className="text-sm text-blue-100 mb-2">TOTAL EARNINGS</p>
          <h2 className="text-4xl font-bold mb-6">
            ₹{totalEarnings.toLocaleString()}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">ACTIVE JOBS</p>
              <p className="text-2xl font-bold">₹{pendingEarnings.toLocaleString()}</p>
              <p className="text-xs text-blue-100 mt-2">
                {activeBookings.length} ongoing
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">COMPLETED</p>
              <p className="text-2xl font-bold">{completedBookings.length}</p>
              <p className="text-xs text-blue-100 mt-2">total jobs</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {['Overview', 'Transactions', 'Withdrawal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-colors ${activeTab === tab.toLowerCase()
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <Calendar className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-2xl font-bold mb-1">
                    {completedBookings.length}
                  </p>
                  <p className="text-sm text-gray-600">Jobs Completed</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <DollarSign className="w-8 h-8 text-green-600 mb-3" />
                  <p className="text-2xl font-bold mb-1">
                    ₹{avgPerJob.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Avg. Per Job</p>
                </div>
              </div>

              {/* Empty state */}
              {completedBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <p className="text-5xl">💰</p>
                  <p className="font-bold text-gray-700">No earnings yet</p>
                  <p className="text-sm text-gray-500 text-center">
                    Complete your first job to start earning!
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 w-full mt-2">
                    <p className="text-sm text-blue-700 font-medium text-center">
                      💡 Go online and accept booking requests to start earning
                    </p>
                  </div>
                </div>
              )}

              {/* Pending requests */}
              {pendingBookings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                  <p className="font-bold text-yellow-800 mb-1">
                    🔔 {pendingBookings.length} Pending Request{pendingBookings.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Accept them to start earning!
                  </p>
                  <button
                    onClick={() => navigate('/provider-dashboard')}
                    className="mt-2 text-sm text-yellow-800 font-bold underline"
                  >
                    View Requests →
                  </button>
                </div>
              )}
            </>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : completedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <p className="text-4xl">📄</p>
                  <p className="font-bold text-gray-700">No transactions yet</p>
                  <p className="text-sm text-gray-500">
                    Completed jobs will appear here
                  </p>
                </div>
              ) : (
                completedBookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold">{booking.customerName}</p>
                        <p className="text-sm text-gray-600 capitalize">{booking.service}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {getTime(booking.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +₹{booking.price || '0'}
                        </p>
                        <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-600 mt-1">
                          PAID
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Withdrawal Tab */}
          {activeTab === 'withdrawal' && (
            <>
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ₹{totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <CreditCard className="w-12 h-12 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">
                  Minimum withdrawal: ₹500
                </p>
              </div>

              {totalEarnings >= 500 ? (
                <button
                  onClick={() => alert('Withdrawal feature coming soon!')}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold mb-4"
                >
                  Withdraw to Bank Account
                </button>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-gray-600 text-sm">
                    Earn at least ₹500 to withdraw
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Current balance: ₹{totalEarnings}
                  </p>
                </div>
              )}

              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  No withdrawal history yet
                </p>
                <p className="text-xs text-gray-500">
                  Complete jobs and withdraw your earnings
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <ProviderBottomNav />
    </div>
  );
}