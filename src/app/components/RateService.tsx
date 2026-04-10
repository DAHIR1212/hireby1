import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Star, FolderOpen } from 'lucide-react';
import { db } from '../firebase/config';
import {
  doc, getDoc, addDoc, updateDoc, collection,
  serverTimestamp, increment, runTransaction
} from 'firebase/firestore';

export default function RateService() {
  const navigate = useNavigate();
  const { id: bookingId } = useParams(); // bookingId
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);

  const customerName = localStorage.getItem('userName') || 'Customer';

  useEffect(() => {
    if (!bookingId) return;
    const fetchBooking = async () => {
      const snap = await getDoc(doc(db, 'bookings', bookingId));
      if (snap.exists()) {
        const data = snap.data();
        setBooking({ id: snap.id, ...data });
        if (data.rated) setAlreadyRated(true);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReviewPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) { alert('Please select a rating'); return; }
    if (!booking) return;
    const text = review.trim();
    setSubmitting(true);

    try {
      if (!booking.providerId) throw new Error("Missing provider reference in booking record.");
      
      const cleanProviderId = booking.providerId.replace(/\D/g, '').slice(-10);
      const providerRef = doc(db, 'users', cleanProviderId);

      console.log(`[REVIEW DEBUG] Target Provider ID: ${cleanProviderId}`);
      console.log(`[REVIEW DEBUG] Target Booking ID: ${bookingId}`);

      // Step 1: Create Review Entry
      console.log("[REVIEW DEBUG] Creating review entry...");
      try {
        await addDoc(collection(db, 'reviews'), {
          bookingId: bookingId,
          providerId: cleanProviderId,
          customerId: booking.customerPhone || 'Unknown',
          customerName,
          rating,
          comment: text,
          photo: reviewPhoto, 
          createdAt: serverTimestamp(),
        });
        console.log("[REVIEW DEBUG] Review entry created successfully.");
      } catch (e: any) {
        console.error("[REVIEW DEBUG] Step 1 Failed:", e);
        throw new Error(`Review Collection Permission Denied: ${e.message}`);
      }

      // Step 2: Update Provider Stats (Read-then-Write since we are debugging)
      console.log("[REVIEW DEBUG] Updating provider stats...");
      try {
        const provSnap = await getDoc(providerRef);
        if (provSnap.exists()) {
          const data = provSnap.data();
          const oldCount = data.ratingCount || 0;
          const oldAvg = data.rating || 0;
          const newCount = oldCount + 1;
          const newAvg = ((oldAvg * oldCount) + rating) / newCount;

          await updateDoc(providerRef, {
            rating: Math.round(newAvg * 10) / 10,
            ratingCount: newCount,
          });
          console.log("[REVIEW DEBUG] Provider stats updated successfully.");
        } else {
          console.warn("[REVIEW DEBUG] Provider doc does not exist, skipping stats update.");
        }
      } catch (e: any) {
        console.error("[REVIEW DEBUG] Step 2 Failed:", e);
        // We might choose to NOT throw here if we want the review to persist even if stats fail
        // but for now let's throw to see the error
        throw new Error(`User Collection Permission Denied: ${e.message}`);
      }

      // Step 3: Mark booking as rated
      console.log("[REVIEW DEBUG] Marking booking as rated...");
      try {
        const bDoc = doc(db, 'bookings', bookingId as string);
        await updateDoc(bDoc, { rated: true });
        console.log("[REVIEW DEBUG] Booking marked as rated successfully.");
      } catch (e: any) {
        console.error("[REVIEW DEBUG] Step 3 Failed:", e);
        throw new Error(`Booking Collection Permission Denied: ${e.message}`);
      }

      setSubmitted(true);
      setTimeout(() => navigate('/my-bookings'), 1800);
    } catch (err: any) {
      console.error("[REVIEW CRITICAL ERROR]", err);
      alert(err.message || 'Submission Failed');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  if (alreadyRated) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-4 bg-white px-6">
        <p className="text-5xl">✅</p>
        <h2 className="text-xl font-bold text-gray-800">Already Rated</h2>
        <p className="text-gray-500 text-center">You've already submitted a review for this booking.</p>
        <button onClick={() => navigate('/my-bookings')} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold">
          Back to Bookings
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="size-full flex flex-col items-center justify-center gap-4 bg-white px-6">
        <p className="text-6xl">🌟</p>
        <h2 className="text-2xl font-bold text-gray-800">Thank You!</h2>
        <p className="text-gray-500 text-center">Your review has been saved and will appear on the provider's profile.</p>
      </div>
    );
  }

  return (
    <div className="size-full flex flex-col bg-white">
      <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Rate Service</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Provider Info */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {booking?.providerName?.[0]?.toUpperCase() || '?'}
          </div>
          <h2 className="text-xl font-bold mb-1">{booking?.providerName || 'Provider'}</h2>
          <p className="text-gray-600 capitalize">{booking?.service || 'Service'}</p>
        </div>

        {/* Stars */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">How was your experience?</h3>
          <div className="flex items-center justify-center gap-3 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${star <= (hoveredRating || rating)
                    ? 'fill-yellow-500 text-yellow-500'
                    : 'text-gray-300'
                    } transition-colors`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-lg font-semibold text-blue-600">
              {ratingLabels[rating - 1]}
            </p>
          )}
        </div>

        {/* Photo Upload (Work Evidence) */}
        <div className="mb-6">
          <label className="block text-[10px] font-black mb-3 text-gray-400 uppercase tracking-widest">
            Capture Evidence (Work Showcase)
          </label>
          <div className="relative">
            {reviewPhoto ? (
               <div className="relative w-full aspect-video rounded-[32px] overflow-hidden border-2 border-dashed border-gray-100 group">
                 <img src={reviewPhoto} className="size-full object-cover" />
                 <button 
                  onClick={() => setReviewPhoto(null)} 
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-black"
                 >✕</button>
               </div>
            ) : (
              <label className="w-full aspect-video flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-100 rounded-[32px] cursor-pointer hover:bg-blue-50/50 transition-all">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                   <FolderOpen className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Select Operation Photo</p>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Review text */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            WRITE A REVIEW (OPTIONAL)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            placeholder="Share your experience with this provider..."
            className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[120px] resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{review.length}/500</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-700">💡 Your review helps others choose the right provider and shows on their profile immediately.</p>
        </div>
      </div>

      <div className="px-6 pb-8 border-t border-gray-100 pt-4">
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || submitting}
          className={`w-full py-4 rounded-xl font-semibold transition-colors ${rating > 0 && !submitting
            ? 'bg-gray-900 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        <button onClick={() => navigate('/my-bookings')} className="w-full py-3 text-gray-600 font-semibold mt-2">
          Skip for Now
        </button>
      </div>
    </div>
  );
}