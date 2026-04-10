import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  ArrowLeft, Star, MapPin, Phone, MessageCircle, CheckCircle, Image as LucideImage 
} from 'lucide-react';
import { db } from '../firebase/config';
import {
  doc, onSnapshot, addDoc, collection,
  serverTimestamp, query, where, orderBy, updateDoc
} from 'firebase/firestore';
import { useNotifications } from '../context/NotificationContext.tsx';

export default function ProviderProfilePage() {
  const navigate = useNavigate();
  const { id: providerId } = useParams();
  const { addNotification } = useNotifications();

  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const customerPhone = localStorage.getItem('userPhone') || '';
  const customerName = localStorage.getItem('userName') || 'Customer';

  // Real-time provider data
  useEffect(() => {
    if (!providerId) return;
    const unsubscribe = onSnapshot(doc(db, 'users', providerId), (snap) => {
      if (snap.exists()) setProvider({ id: snap.id, ...snap.data() });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [providerId]);

  // Real-time reviews
  useEffect(() => {
    if (!providerId) return;
    const q = query(
      collection(db, 'reviews'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, [providerId]);

  const handleBook = async () => {
    if (!provider) return;
    setBooking(true);
    try {
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        customerId: customerPhone,
        customerPhone,
        customerName,
        providerId: provider.id,
        providerName: provider.name,
        service: provider.category,
        status: 'pending',
        price: provider.hourlyRate || '0',
        address: localStorage.getItem('userLocation') || '',
        scheduledTime: 'As soon as possible',
        createdAt: serverTimestamp(),
        rated: false,
      });
      await addNotification(
        provider.id,
        '🔔 New Booking Request!',
        `${customerName} wants to book your ${provider.category} service.`,
        'booking',
        { bookingId: bookingRef.id }
      );
      setBooked(true);
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to book. Try again.');
    } finally {
      setBooking(false);
    }
  };

  const getTimeAgo = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-4">
        <p className="text-xl">😕</p>
        <p className="font-bold text-gray-700">Provider not found</p>
        <button onClick={() => navigate(-1)} className="text-blue-600">Go back</button>
      </div>
    );
  }

  const avgRating = provider.rating || 0;
  const jobsDone = provider.jobsDone || 0;
  const ratingCount = provider.ratingCount || 0;

  return (
    <div className="size-full flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg flex-1">Provider Profile</h1>
        <div className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${provider.isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
          <div className={`w-2 h-2 rounded-full ${provider.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {provider.isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">

        {/* Profile Card */}
        <div className="bg-white px-6 py-6 mb-3">
          <div className="flex items-start gap-4 mb-5">
            {provider.photo ? (
              <img src={provider.photo} alt={provider.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-100" />
            ) : (
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {provider.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold">{provider.name}</h2>
              <p className="text-blue-600 font-medium capitalize">{provider.category}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-sm">{provider?.rating ? provider.rating.toFixed(1) : 'New'}</span>
                </div>
                <span className="text-gray-300">|</span>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-tight">
                  {provider?.ratingCount || 0} Reviews
                </p>
              </div>
              <p className="text-[10px] text-blue-600 font-black mt-2 uppercase tracking-widest">
                {provider?.experience || 'Verified Specialist'}
              </p>
              {provider.location && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-2 font-medium italic">
                  <MapPin className="w-3 h-3 text-red-500" /> {provider.location}
                </p>
              )}
            </div>
          </div>

          {/* Real Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-blue-600">
                {avgRating > 0 ? avgRating.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-green-600">{jobsDone}</p>
              <p className="text-xs text-gray-500">Jobs Done</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-purple-600 capitalize">
                {provider.experience || 'Pro'}
              </p>
              <p className="text-xs text-gray-500">Level</p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Service Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {provider.hourlyRate ? `₹${provider.hourlyRate}` : 'Negotiable'}
                {provider.hourlyRate && <span className="text-sm font-normal text-gray-500">/hr</span>}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Availability</p>
              <p className="text-sm font-semibold capitalize">{provider.availability || 'Flexible'}</p>
            </div>
          </div>
        </div>

        {/* Work Showcase (New Portfolio Feature) */}
        {reviews.some(r => r.photo) && (
          <div className="mb-10 px-6">
            <h3 className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <LucideImage className="w-3.5 h-3.5" />
              Operational Showcase
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-6 px-6">
              {reviews.filter(r => r.photo).map((rev, idx) => (
                <div key={idx} className="relative w-64 h-44 flex-shrink-0 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group">
                  <img src={rev.photo} className="size-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">{rev.customerName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {provider.skills && provider.skills.length > 0 && (
          <div className="bg-white px-6 py-5 mb-3">
            <h3 className="font-bold text-lg mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill: string) => (
                <div key={skill} className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Images */}
        {provider.workImages && provider.workImages.length > 0 && (
          <div className="bg-white px-6 py-5 mb-3">
            <h3 className="font-bold text-lg mb-3">Previous Work</h3>
            <div className="grid grid-cols-2 gap-2">
              {provider.workImages.map((img: string, i: number) => (
                <img key={i} src={img} alt={`Work ${i + 1}`} className="w-full h-32 object-cover rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {/* ⭐ Real Reviews Section */}
        <div className="bg-white px-6 py-5 mb-3">
          <h3 className="font-bold text-lg mb-4">
            Reviews {reviews.length > 0 && <span className="text-gray-400 font-normal text-base">({reviews.length})</span>}
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-2">💬</p>
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to rate!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
                        {r.customerName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-semibold text-sm">{r.customerName}</span>
                    </div>
                    <span className="text-xs text-gray-400">{getTimeAgo(r.createdAt)}</span>
                  </div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-white px-6 py-5 mb-3">
          <h3 className="font-bold text-lg mb-3">Contact</h3>
          <div className="flex gap-3">
            <button
               onClick={() => navigate(`/chat?providerId=${provider.id}&providerName=${provider.name}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold"
            >
              <MessageCircle className="w-5 h-5" /> Message
            </button>
            <button
              onClick={() => window.open(`tel:+91${provider.id}`)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-600 rounded-xl font-semibold"
            >
              <Phone className="w-5 h-5" /> Call
            </button>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        {booked ? (
          <div className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> Booking Sent! Redirecting...
          </div>
        ) : (
          <button
            onClick={handleBook}
            disabled={booking || !provider.isOnline}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${provider.isOnline && !booking
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {booking ? 'Sending Request...' :
              !provider.isOnline ? 'Provider Offline' :
                `Book Now${provider.hourlyRate ? ` • ₹${provider.hourlyRate}/hr` : ''}`}
          </button>
        )}
      </div>
    </div>
  );
}